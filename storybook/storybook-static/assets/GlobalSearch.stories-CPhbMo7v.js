import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-JhL3uwfD.js";const B="_wrapper_rxvqu_1",N="_trigger_rxvqu_8",L="_inputWrapper_rxvqu_32",M="_inputIcon_rxvqu_54",T="_input_rxvqu_32",G="_closeButton_rxvqu_80",r={wrapper:B,trigger:N,inputWrapper:L,inputIcon:M,input:T,closeButton:G};function f({placeholder:a="Search...",onSearch:i,expanded:d,className:q,...I}){const[W,h]=s.useState(!1),[p,l]=s.useState(""),u=s.useRef(null),x=d??W;s.useEffect(()=>{x&&u.current&&u.current.focus()},[x]);function g(){d===void 0&&h(n=>!n)}function E(n){n.key==="Enter"&&p.trim()&&(i==null||i(p.trim())),n.key==="Escape"&&d===void 0&&(h(!1),l(""))}return e.jsx("div",{className:[r.wrapper,q].filter(Boolean).join(" "),...I,children:x?e.jsxs("div",{className:r.inputWrapper,children:[e.jsx(m,{className:r.inputIcon}),e.jsx("input",{ref:u,type:"search",className:r.input,placeholder:a,value:p,onChange:n=>l(n.target.value),onKeyDown:E,"aria-label":"Search"}),e.jsx("button",{className:r.closeButton,onClick:()=>{g(),l("")},"aria-label":"Close search",children:e.jsx(O,{})})]}):e.jsx("button",{className:r.trigger,onClick:g,"aria-label":"Open search",children:e.jsx(m,{})})})}function m({className:a}){return e.jsxs("svg",{className:a,width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"7",cy:"7",r:"4.5",stroke:"currentColor",strokeWidth:"1.5"}),e.jsx("path",{d:"M10.5 10.5L14 14",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}function O(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M4 4L12 12M12 4L4 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})}f.__docgenInfo={description:"",methods:[],displayName:"GlobalSearch",props:{placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Search..."',computed:!1}},onSearch:{required:!1,tsType:{name:"signature",type:"function",raw:"(query: string) => void",signature:{arguments:[{type:{name:"string"},name:"query"}],return:{name:"void"}}},description:""},expanded:{required:!1,tsType:{name:"boolean"},description:""}},composes:["Omit"]};const D={title:"Synapse/GlobalSearch",component:f,argTypes:{expanded:{control:"boolean"}}},t={args:{expanded:!1},decorators:[a=>e.jsx("div",{style:{background:"var(--color-background-masthead-brand-base)",padding:"8px 16px",display:"flex",justifyContent:"flex-end"},children:e.jsx(a,{})})]},o={args:{expanded:!0,placeholder:"Search pages, components, docs..."}},c={render:()=>e.jsxs("div",{style:{background:"var(--color-background-masthead-brand-base)",padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:48},children:[e.jsx("span",{style:{color:"#fff",fontWeight:500,fontSize:16},children:"Synapse"}),e.jsx(f,{placeholder:"Search..."})]}),parameters:{layout:"fullscreen"}};var y,b,v;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    expanded: false
  },
  decorators: [Story => <div style={{
    background: "var(--color-background-masthead-brand-base)",
    padding: "8px 16px",
    display: "flex",
    justifyContent: "flex-end"
  }}>
        <Story />
      </div>]
}`,...(v=(b=t.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var j,_,S;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    expanded: true,
    placeholder: "Search pages, components, docs..."
  }
}`,...(S=(_=o.parameters)==null?void 0:_.docs)==null?void 0:S.source}}};var k,C,w;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <div style={{
    background: "var(--color-background-masthead-brand-base)",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48
  }}>
      <span style={{
      color: "#fff",
      fontWeight: 500,
      fontSize: 16
    }}>
        Synapse
      </span>
      <GlobalSearch placeholder="Search..." />
    </div>,
  parameters: {
    layout: "fullscreen"
  }
}`,...(w=(C=c.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};const K=["Collapsed","Expanded","InMasthead"];export{t as Collapsed,o as Expanded,c as InMasthead,K as __namedExportsOrder,D as default};
