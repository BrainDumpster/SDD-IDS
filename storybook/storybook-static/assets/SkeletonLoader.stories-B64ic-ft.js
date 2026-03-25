import{j as e}from"./jsx-runtime-D_zvdyIk.js";const C="_skeleton_1fx7u_1",D="_pulse_1fx7u_1",T="_text_1fx7u_6",R="_circle_1fx7u_12",W="_rectangle_1fx7u_18",d={skeleton:C,pulse:D,text:T,circle:R,rectangle:W};function t({variant:b="text",width:n,height:r}){const c={};return n&&(c.width=typeof n=="number"?`${n}px`:n),r&&(c.height=typeof r=="number"?`${r}px`:r),e.jsx("div",{className:`${d.skeleton} ${d[b]}`,style:c,"aria-hidden":"true"})}t.__docgenInfo={description:"",methods:[],displayName:"SkeletonLoader",props:{variant:{required:!1,tsType:{name:"union",raw:'"text" | "circle" | "rectangle"',elements:[{name:"literal",value:'"text"'},{name:"literal",value:'"circle"'},{name:"literal",value:'"rectangle"'}]},description:"",defaultValue:{value:'"text"',computed:!1}},width:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""},height:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""}}};const q={title:"Synapse/SkeletonLoader",component:t,argTypes:{variant:{control:"select",options:["text","circle","rectangle"]}}},a={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:8,maxWidth:360},children:[e.jsx(t,{variant:"text"}),e.jsx(t,{variant:"text",width:"80%"}),e.jsx(t,{variant:"text",width:"60%"})]})},i={args:{variant:"circle"}},s={args:{variant:"circle",width:64,height:64}},l={args:{variant:"rectangle"}},o={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16,maxWidth:320,padding:16,border:"1px solid var(--color-border-light)",borderRadius:8},children:[e.jsx(t,{variant:"rectangle",height:160}),e.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[e.jsx(t,{variant:"circle",width:36,height:36}),e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:6},children:[e.jsx(t,{variant:"text",width:"60%"}),e.jsx(t,{variant:"text",width:"40%"})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6},children:[e.jsx(t,{variant:"text"}),e.jsx(t,{variant:"text"}),e.jsx(t,{variant:"text",width:"75%"})]})]})};var x,p,m;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 360
  }}>
      <SkeletonLoader variant="text" />
      <SkeletonLoader variant="text" width="80%" />
      <SkeletonLoader variant="text" width="60%" />
    </div>
}`,...(m=(p=a.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,g,v;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: "circle"
  }
}`,...(v=(g=i.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var f,h,y;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    variant: "circle",
    width: 64,
    height: 64
  }
}`,...(y=(h=s.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var S,_,j;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    variant: "rectangle"
  }
}`,...(j=(_=l.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};var k,L,w;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxWidth: 320,
    padding: 16,
    border: "1px solid var(--color-border-light)",
    borderRadius: 8
  }}>
      <SkeletonLoader variant="rectangle" height={160} />
      <div style={{
      display: "flex",
      gap: 12,
      alignItems: "center"
    }}>
        <SkeletonLoader variant="circle" width={36} height={36} />
        <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 6
      }}>
          <SkeletonLoader variant="text" width="60%" />
          <SkeletonLoader variant="text" width="40%" />
        </div>
      </div>
      <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 6
    }}>
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" />
        <SkeletonLoader variant="text" width="75%" />
      </div>
    </div>
}`,...(w=(L=o.parameters)==null?void 0:L.docs)==null?void 0:w.source}}};const I=["TextLines","Circle","CircleLarge","Rectangle","CardComposition"];export{o as CardComposition,i as Circle,s as CircleLarge,l as Rectangle,a as TextLines,I as __namedExportsOrder,q as default};
