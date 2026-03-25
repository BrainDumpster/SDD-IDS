import{j as e}from"./jsx-runtime-D_zvdyIk.js";const h="_tag_v1ese_1",D="_info_v1ese_25",S="_success_v1ese_30",W="_warning_v1ese_35",A="_error_v1ese_40",V="_label_v1ese_46",q="_dismiss_v1ese_50",a={tag:h,default:"_default_v1ese_20",info:D,success:S,warning:W,error:A,label:V,dismiss:q};function s({label:t,variant:y="default",dismissible:j=!1,onDismiss:w,disabled:o}){return e.jsxs("span",{className:`${a.tag} ${a[y]}`,"data-disabled":o||void 0,children:[e.jsx("span",{className:a.label,children:t}),j&&e.jsx("button",{className:a.dismiss,onClick:w,disabled:o,"aria-label":`Remove ${t}`,type:"button",children:e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:e.jsx("path",{d:"M9 3L3 9M3 3L9 9",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})})]})}s.__docgenInfo={description:"",methods:[],displayName:"Tag",props:{label:{required:!0,tsType:{name:"string"},description:""},variant:{required:!1,tsType:{name:"union",raw:'"default" | "info" | "success" | "warning" | "error"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"info"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'}]},description:"",defaultValue:{value:'"default"',computed:!1}},dismissible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onDismiss:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""}}};const E={title:"Synapse/Tag",component:s,argTypes:{variant:{control:"select",options:["default","info","success","warning","error"]},dismissible:{control:"boolean"},disabled:{control:"boolean"}}},r={args:{label:"Tag"}},i={args:{label:"Removable",dismissible:!0}},n={render:()=>e.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e.jsx(s,{label:"Default"}),e.jsx(s,{label:"Info",variant:"info"}),e.jsx(s,{label:"Success",variant:"success"}),e.jsx(s,{label:"Warning",variant:"warning"}),e.jsx(s,{label:"Error",variant:"error"})]})},l={render:()=>e.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[e.jsx(s,{label:"Filter A",dismissible:!0}),e.jsx(s,{label:"Active",variant:"success",dismissible:!0}),e.jsx(s,{label:"Pending",variant:"warning",dismissible:!0}),e.jsx(s,{label:"Failed",variant:"error",dismissible:!0})]})};var c,d,u;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    label: "Tag"
  }
}`,...(u=(d=r.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var m,p,b;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Removable",
    dismissible: true
  }
}`,...(b=(p=i.parameters)==null?void 0:p.docs)==null?void 0:b.source}}};var g,v,f;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 8,
    flexWrap: "wrap"
  }}>
      <Tag label="Default" />
      <Tag label="Info" variant="info" />
      <Tag label="Success" variant="success" />
      <Tag label="Warning" variant="warning" />
      <Tag label="Error" variant="error" />
    </div>
}`,...(f=(v=n.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var x,_,T;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 8,
    flexWrap: "wrap"
  }}>
      <Tag label="Filter A" dismissible />
      <Tag label="Active" variant="success" dismissible />
      <Tag label="Pending" variant="warning" dismissible />
      <Tag label="Failed" variant="error" dismissible />
    </div>
}`,...(T=(_=l.parameters)==null?void 0:_.docs)==null?void 0:T.source}}};const F=["Default","Dismissible","AllVariants","DismissibleVariants"];export{n as AllVariants,r as Default,i as Dismissible,l as DismissibleVariants,F as __namedExportsOrder,E as default};
