import{j as e}from"./jsx-runtime-D_zvdyIk.js";const L="_spinner_pjqg2_1",T="_sm_pjqg2_7",A="_md_pjqg2_12",k="_lg_pjqg2_17",N="_svg_pjqg2_22",b="_spin_pjqg2_1",O="_track_pjqg2_28",M="_arc_pjqg2_32",W="_srOnly_pjqg2_37",s={spinner:L,sm:T,md:A,lg:k,svg:N,spin:b,track:O,arc:M,srOnly:W};function n({size:h="md",label:q="Loading"}){return e.jsxs("span",{className:`${s.spinner} ${s[h]}`,role:"status",children:[e.jsxs("svg",{className:s.svg,viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[e.jsx("circle",{className:s.track,cx:"12",cy:"12",r:"10",strokeWidth:"3"}),e.jsx("circle",{className:s.arc,cx:"12",cy:"12",r:"10",strokeWidth:"3",strokeLinecap:"round"})]}),e.jsx("span",{className:s.srOnly,children:q})]})}n.__docgenInfo={description:"",methods:[],displayName:"Spinner",props:{size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Loading"',computed:!1}}}};const w={title:"Synapse/Spinner",component:n,argTypes:{size:{control:"select",options:["sm","md","lg"]}}},r={args:{size:"sm"}},a={args:{size:"md"}},t={args:{size:"lg"}},l={render:()=>e.jsxs("div",{style:{display:"flex",gap:24,alignItems:"center"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(n,{size:"sm"}),e.jsx("p",{style:{marginTop:8,fontSize:12,color:"var(--color-text-neutral)"},children:"Small"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(n,{size:"md"}),e.jsx("p",{style:{marginTop:8,fontSize:12,color:"var(--color-text-neutral)"},children:"Medium"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(n,{size:"lg"}),e.jsx("p",{style:{marginTop:8,fontSize:12,color:"var(--color-text-neutral)"},children:"Large"})]})]})},i={args:{size:"md",label:"Fetching data"}};var o,c,d;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    size: "sm"
  }
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var m,p,g;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    size: "md"
  }
}`,...(g=(p=a.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var u,x,_;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    size: "lg"
  }
}`,...(_=(x=t.parameters)==null?void 0:x.docs)==null?void 0:_.source}}};var v,y,j;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 24,
    alignItems: "center"
  }}>
      <div style={{
      textAlign: "center"
    }}>
        <Spinner size="sm" />
        <p style={{
        marginTop: 8,
        fontSize: 12,
        color: "var(--color-text-neutral)"
      }}>Small</p>
      </div>
      <div style={{
      textAlign: "center"
    }}>
        <Spinner size="md" />
        <p style={{
        marginTop: 8,
        fontSize: 12,
        color: "var(--color-text-neutral)"
      }}>Medium</p>
      </div>
      <div style={{
      textAlign: "center"
    }}>
        <Spinner size="lg" />
        <p style={{
        marginTop: 8,
        fontSize: 12,
        color: "var(--color-text-neutral)"
      }}>Large</p>
      </div>
    </div>
}`,...(j=(y=l.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var z,S,f;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    size: "md",
    label: "Fetching data"
  }
}`,...(f=(S=i.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};const C=["Small","Medium","Large","AllSizes","WithCustomLabel"];export{l as AllSizes,t as Large,a as Medium,r as Small,i as WithCustomLabel,C as __namedExportsOrder,w as default};
