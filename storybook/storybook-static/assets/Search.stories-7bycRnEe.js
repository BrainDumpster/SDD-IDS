import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as u}from"./index-JhL3uwfD.js";const I="_wrapper_9p8co_1",V="_searchIcon_9p8co_29",T="_input_9p8co_34",q="_clear_9p8co_60",l={wrapper:I,searchIcon:V,input:T,clear:q};function a({placeholder:d="Search...",value:s,onChange:r,onClear:t,disabled:p,className:W,...w}){const C=u.useCallback(L=>{r==null||r(L.target.value)},[r]),D=u.useCallback(()=>{t==null||t(),r==null||r("")},[t,r]);return e.jsxs("div",{className:`${l.wrapper} ${W||""}`,"data-disabled":p||void 0,children:[e.jsx(E,{}),e.jsx("input",{type:"search",className:l.input,placeholder:d,value:s,onChange:C,disabled:p,...w}),s&&!p&&e.jsx("button",{type:"button",className:l.clear,onClick:D,"aria-label":"Clear search",children:e.jsx(N,{})})]})}function E(){return e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",className:l.searchIcon,"aria-hidden":"true",children:[e.jsx("path",{d:"M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M14 14L10.5 10.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})}function N(){return e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:e.jsx("path",{d:"M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})}a.__docgenInfo={description:"",methods:[],displayName:"Search",props:{placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Search..."',computed:!1}},value:{required:!1,tsType:{name:"string"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},onClear:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""}},composes:["Omit"]};const B={title:"Synapse/Search",component:a,argTypes:{disabled:{control:"boolean"}}},n={args:{placeholder:"Search..."}},o={render:()=>{const[d,s]=u.useState("design tokens");return e.jsx("div",{style:{maxWidth:360},children:e.jsx(a,{value:d,onChange:s,onClear:()=>s(""),placeholder:"Search..."})})}},c={args:{placeholder:"Search is disabled",disabled:!0}},i={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16,maxWidth:360},children:[e.jsx(a,{placeholder:"Empty search"}),e.jsx(a,{value:"With text",onChange:()=>{},onClear:()=>{}}),e.jsx(a,{placeholder:"Disabled",disabled:!0})]})};var h,m,x;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    placeholder: "Search..."
  }
}`,...(x=(m=n.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};var v,g,S;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("design tokens");
    return <div style={{
      maxWidth: 360
    }}>
        <Search value={value} onChange={setValue} onClear={() => setValue("")} placeholder="Search..." />
      </div>;
  }
}`,...(S=(g=o.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var f,y,j;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    placeholder: "Search is disabled",
    disabled: true
  }
}`,...(j=(y=c.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var b,k,_;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxWidth: 360
  }}>
      <Search placeholder="Empty search" />
      <Search value="With text" onChange={() => {}} onClear={() => {}} />
      <Search placeholder="Disabled" disabled />
    </div>
}`,...(_=(k=i.parameters)==null?void 0:k.docs)==null?void 0:_.source}}};const O=["Default","WithValue","Disabled","AllStates"];export{i as AllStates,n as Default,c as Disabled,o as WithValue,O as __namedExportsOrder,B as default};
