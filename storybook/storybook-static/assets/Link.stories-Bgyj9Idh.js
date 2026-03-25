import{j as e}from"./jsx-runtime-D_zvdyIk.js";const _="_link_1e2ss_1",I="_externalIcon_1e2ss_36",L={link:_,externalIcon:I};function r({href:j,children:y,external:o,disabled:n,className:v,...D}){return e.jsxs("a",{href:n?void 0:j,className:`${L.link} ${v||""}`,"data-disabled":n||void 0,target:o?"_blank":void 0,rel:o?"noopener noreferrer":void 0,"aria-disabled":n||void 0,tabIndex:n?-1:void 0,...D,children:[y,o&&e.jsx(w,{})]})}function w(){return e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",className:L.externalIcon,"aria-hidden":"true",children:[e.jsx("path",{d:"M9 6.5V9.5C9 10.0523 8.55228 10.5 8 10.5H2.5C1.94772 10.5 1.5 10.0523 1.5 9.5V4C1.5 3.44772 1.94772 3 2.5 3H5.5",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M7.5 1.5H10.5V4.5",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M5 7L10.5 1.5",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]})}r.__docgenInfo={description:"",methods:[],displayName:"Link",props:{href:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},external:{required:!1,tsType:{name:"boolean"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""}},composes:["Omit"]};const S={title:"Synapse/Link",component:r,argTypes:{external:{control:"boolean"},disabled:{control:"boolean"}}},a={args:{href:"#",children:"Internal link"}},s={args:{href:"https://example.com",children:"Open in new tab",external:!0}},t={args:{href:"#",children:"Disabled link",disabled:!0}},i={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsx(r,{href:"#",children:"Default link"}),e.jsx(r,{href:"https://example.com",external:!0,children:"External link"}),e.jsx(r,{href:"#",disabled:!0,children:"Disabled link"}),e.jsxs("p",{style:{fontSize:14,color:"var(--color-text-neutral)"},children:["This is a paragraph with an ",e.jsx(r,{href:"#",children:"inline link"})," inside it."]})]})};var l,d,c;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    href: "#",
    children: "Internal link"
  }
}`,...(c=(d=a.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var p,h,u;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    href: "https://example.com",
    children: "Open in new tab",
    external: true
  }
}`,...(u=(h=s.parameters)==null?void 0:h.docs)==null?void 0:u.source}}};var m,x,k;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    href: "#",
    children: "Disabled link",
    disabled: true
  }
}`,...(k=(x=t.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};var f,g,b;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 12
  }}>
      <Link href="#">Default link</Link>
      <Link href="https://example.com" external>External link</Link>
      <Link href="#" disabled>Disabled link</Link>
      <p style={{
      fontSize: 14,
      color: "var(--color-text-neutral)"
    }}>
        This is a paragraph with an <Link href="#">inline link</Link> inside it.
      </p>
    </div>
}`,...(b=(g=i.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};const T=["Default","External","Disabled","AllVariants"];export{i as AllVariants,a as Default,t as Disabled,s as External,T as __namedExportsOrder,S as default};
