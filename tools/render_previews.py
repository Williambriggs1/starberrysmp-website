#!/usr/bin/env python3
from pathlib import Path
import argparse, json, math
import numpy as np
import cv2
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

FACE_VERTICES = {
    "north": lambda f,t: [(f[0],f[1],f[2]),(t[0],f[1],f[2]),(t[0],t[1],f[2]),(f[0],t[1],f[2])],
    "south": lambda f,t: [(t[0],f[1],t[2]),(f[0],f[1],t[2]),(f[0],t[1],t[2]),(t[0],t[1],t[2])],
    "west":  lambda f,t: [(f[0],f[1],t[2]),(f[0],f[1],f[2]),(f[0],t[1],f[2]),(f[0],t[1],t[2])],
    "east":  lambda f,t: [(t[0],f[1],f[2]),(t[0],f[1],t[2]),(t[0],t[1],t[2]),(t[0],t[1],f[2])],
    "up":    lambda f,t: [(f[0],t[1],f[2]),(t[0],t[1],f[2]),(t[0],t[1],t[2]),(f[0],t[1],t[2])],
    "down":  lambda f,t: [(f[0],f[1],t[2]),(t[0],f[1],t[2]),(t[0],f[1],f[2]),(f[0],f[1],f[2])]
}
SHADE={"up":1.08,"down":0.62,"north":0.82,"south":1.0,"east":0.90,"west":0.74}

def rotation_matrix(yaw,pitch):
    y=math.radians(yaw); x=math.radians(pitch)
    ry=np.array([[math.cos(y),0,math.sin(y)],[0,1,0],[-math.sin(y),0,math.cos(y)]],float)
    rx=np.array([[1,0,0],[0,math.cos(x),-math.sin(x)],[0,math.sin(x),math.cos(x)]],float)
    return rx@ry

def alpha_comp(dst,src):
    sa=src[:,:,3:4].astype(np.float32)/255
    da=dst[:,:,3:4].astype(np.float32)/255
    oa=sa+da*(1-sa)
    denom=np.maximum(oa,1e-6)
    rgb=(src[:,:,:3]*sa+dst[:,:,:3]*da*(1-sa))/denom
    out=np.zeros_like(dst)
    out[:,:,:3]=np.clip(rgb,0,255).astype(np.uint8)
    out[:,:,3]=np.clip(oa[:,:,0]*255,0,255).astype(np.uint8)
    return out

def shade(img,factor):
    out=img.copy()
    out[:,:,:3]=np.clip(out[:,:,:3].astype(np.float32)*factor,0,255).astype(np.uint8)
    return out

def uv_crop(tex,uv):
    h,w=tex.shape[:2]
    u1,v1,u2,v2=map(float,uv)
    x1,x2=u1/16*w,u2/16*w
    y1,y2=v1/16*h,v2/16*h
    flipx=x2<x1; flipy=y2<y1
    xa,xb=sorted((x1,x2)); ya,yb=sorted((y1,y2))
    xa=max(0,min(w-1,int(round(xa)))); xb=max(xa+1,min(w,int(round(xb))))
    ya=max(0,min(h-1,int(round(ya)))); yb=max(ya+1,min(h,int(round(yb))))
    crop=tex[ya:yb,xa:xb].copy()
    if flipx: crop=crop[:,::-1]
    if flipy: crop=crop[::-1,:]
    return crop

def default_uv(face,f,t):
    dx,dy,dz=t[0]-f[0],t[1]-f[1],t[2]-f[2]
    if face in ("up","down"): return [0,0,dx,dz]
    if face in ("north","south"): return [0,0,dx,dy]
    return [0,0,dz,dy]

def render(entry,base):
    model=json.loads((base/entry["model"]).read_text(encoding="utf-8"))
    textures={k:np.array(Image.open(base/v).convert("RGBA")) for k,v in entry.get("textures",{}).items()}
    size=int(entry.get("size",512))
    canvas=np.zeros((size,size,4),dtype=np.uint8)
    R=rotation_matrix(float(entry.get("yaw",35)),float(entry.get("pitch",25)))

    raw=[]; points=[]
    for el in model.get("elements",[]):
        f=el.get("from",[0,0,0]); t=el.get("to",[16,16,16]); faces=el.get("faces",{})
        for name,maker in FACE_VERTICES.items():
            if faces and name not in faces: continue
            verts=np.array(maker(f,t),float)-np.array([8,8,8])
            verts=verts@R.T
            raw.append((name,faces.get(name,{}),f,t,verts))
            points.extend(verts.tolist())

    if not points:
        raise ValueError("No renderable cuboids found.")

    pts=np.array(points)
    span=np.maximum(pts[:,:2].max(0)-pts[:,:2].min(0),1e-6)
    scale=min(size*.72/span[0],size*.72/span[1])
    center=np.array([size/2,size/2+size*.04])

    draw=[]
    for name,fd,f,t,verts in raw:
        quad=np.empty((4,2),dtype=np.float32)
        quad[:,0]=center[0]+verts[:,0]*scale
        quad[:,1]=center[1]-verts[:,1]*scale
        draw.append((verts[:,2].mean(),name,fd,f,t,quad))
    draw.sort(key=lambda x:x[0])

    for _,name,fd,f,t,quad in draw:
        ref=fd.get("texture","")
        key=ref[1:] if isinstance(ref,str) and ref.startswith("#") else None
        tex=textures.get(key) if key else None

        if tex is None:
            layer=np.zeros_like(canvas)
            cv2.fillConvexPoly(layer,quad.astype(np.int32),(210,92,122,255))
            canvas=alpha_comp(canvas,shade(layer,SHADE.get(name,1)))
            continue

        crop=shade(uv_crop(tex,fd.get("uv") or default_uv(name,f,t)),SHADE.get(name,1))
        h,w=crop.shape[:2]
        src=np.array([[0,0],[w-1,0],[w-1,h-1],[0,h-1]],dtype=np.float32)
        M=cv2.getPerspectiveTransform(src,quad)
        warped=cv2.warpPerspective(crop,M,(size,size),flags=cv2.INTER_NEAREST,
                                   borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
        canvas=alpha_comp(canvas,warped)

    out=(base/entry["output"]).resolve()
    out.parent.mkdir(parents=True,exist_ok=True)
    Image.fromarray(canvas,"RGBA").save(out,"WEBP",quality=92,method=6)
    print(f"Rendered {entry.get('id','model')} -> {out}")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--manifest",default=str(ROOT/"private_assets"/"preview_manifest.json"))
    args=ap.parse_args()
    manifest=Path(args.manifest).resolve()
    if not manifest.exists():
        raise SystemExit("Copy private_assets.example to private_assets and add your real files.")
    data=json.loads(manifest.read_text(encoding="utf-8"))
    for entry in data.get("entries",[]):
        render(entry,manifest.parent)

if __name__=="__main__":
    main()
