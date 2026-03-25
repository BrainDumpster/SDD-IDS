import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as M}from"./index-JhL3uwfD.js";const T="_alert_wfmr2_1",E="_info_wfmr2_12",q="_icon_wfmr2_16",B="_success_wfmr2_20",P="_warning_wfmr2_28",Y="_error_wfmr2_36",O="_text_wfmr2_51",U="_title_wfmr2_59",X="_description_wfmr2_66",$="_close_wfmr2_72",s={alert:T,info:E,icon:q,success:B,warning:P,error:Y,text:O,title:U,description:X,close:$};function r({variant:i="info",title:u,description:p,dismissible:W=!1,onDismiss:d}){const[z,N]=M.useState(!1);if(z)return null;const V=()=>{N(!0),d==null||d()};return e.jsxs("div",{className:`${s.alert} ${s[i]}`,role:"alert",children:[e.jsx("span",{className:s.icon,children:e.jsx(H,{variant:i})}),e.jsxs("div",{className:s.text,children:[e.jsx("span",{className:s.title,children:u}),p&&e.jsx("span",{className:s.description,children:p})]}),W&&e.jsx("button",{className:s.close,onClick:V,"aria-label":"Dismiss alert",type:"button",children:e.jsx(R,{})})]})}function H({variant:i}){switch(i){case"info":return e.jsxs("svg",{width:20,height:20,viewBox:"0 0 20 20",fill:"none",children:[e.jsx("circle",{cx:"10",cy:"10",r:"9",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M10 9V14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),e.jsx("circle",{cx:"10",cy:"6.5",r:"1",fill:"currentColor"})]});case"success":return e.jsxs("svg",{width:20,height:20,viewBox:"0 0 20 20",fill:"none",children:[e.jsx("circle",{cx:"10",cy:"10",r:"9",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M6 10L9 13L14 7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]});case"warning":return e.jsxs("svg",{width:20,height:20,viewBox:"0 0 20 20",fill:"none",children:[e.jsx("path",{d:"M10 2L19 18H1L10 2Z",stroke:"currentColor",strokeWidth:"2",strokeLinejoin:"round"}),e.jsx("path",{d:"M10 8V12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),e.jsx("circle",{cx:"10",cy:"15",r:"1",fill:"currentColor"})]});case"error":return e.jsxs("svg",{width:20,height:20,viewBox:"0 0 20 20",fill:"none",children:[e.jsx("circle",{cx:"10",cy:"10",r:"9",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M7 7L13 13M13 7L7 13",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]})}}function R(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M12 4L4 12M4 4L12 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}r.__docgenInfo={description:"",methods:[],displayName:"InlineAlert",props:{variant:{required:!1,tsType:{name:"union",raw:'"info" | "success" | "warning" | "error"',elements:[{name:"literal",value:'"info"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'}]},description:"",defaultValue:{value:'"info"',computed:!1}},title:{required:!0,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""},dismissible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onDismiss:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const G={title:"Synapse/InlineAlert",component:r,argTypes:{variant:{control:"select",options:["info","success","warning","error"]},dismissible:{control:"boolean"}}},t={args:{variant:"info",title:"New features available",description:"Check out the latest updates in the changelog."}},n={args:{variant:"success",title:"Changes saved",description:"Your profile has been updated successfully."}},a={args:{variant:"warning",title:"Unsaved changes",description:"You have unsaved changes that will be lost if you navigate away."}},o={args:{variant:"error",title:"Validation failed",description:"Please correct the errors below before submitting."}},l={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsx(r,{variant:"info",title:"Dismissible info alert",description:"Click the X to dismiss.",dismissible:!0}),e.jsx(r,{variant:"success",title:"Dismissible success alert",dismissible:!0}),e.jsx(r,{variant:"warning",title:"Dismissible warning alert",description:"This can be closed.",dismissible:!0}),e.jsx(r,{variant:"error",title:"Dismissible error alert",dismissible:!0})]})},c={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsx(r,{variant:"info",title:"Info",description:"Informational message for the user."}),e.jsx(r,{variant:"success",title:"Success",description:"Operation completed."}),e.jsx(r,{variant:"warning",title:"Warning",description:"Proceed with caution."}),e.jsx(r,{variant:"error",title:"Error",description:"Something went wrong."})]})};var m,f,h;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: "info",
    title: "New features available",
    description: "Check out the latest updates in the changelog."
  }
}`,...(h=(f=t.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};var g,v,x;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    variant: "success",
    title: "Changes saved",
    description: "Your profile has been updated successfully."
  }
}`,...(x=(v=n.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var w,b,j;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    variant: "warning",
    title: "Unsaved changes",
    description: "You have unsaved changes that will be lost if you navigate away."
  }
}`,...(j=(b=a.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};var _,k,y;o.parameters={...o.parameters,docs:{...(_=o.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: "error",
    title: "Validation failed",
    description: "Please correct the errors below before submitting."
  }
}`,...(y=(k=o.parameters)==null?void 0:k.docs)==null?void 0:y.source}}};var I,C,L;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 12
  }}>
      <InlineAlert variant="info" title="Dismissible info alert" description="Click the X to dismiss." dismissible />
      <InlineAlert variant="success" title="Dismissible success alert" dismissible />
      <InlineAlert variant="warning" title="Dismissible warning alert" description="This can be closed." dismissible />
      <InlineAlert variant="error" title="Dismissible error alert" dismissible />
    </div>
}`,...(L=(C=l.parameters)==null?void 0:C.docs)==null?void 0:L.source}}};var D,S,A;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 12
  }}>
      <InlineAlert variant="info" title="Info" description="Informational message for the user." />
      <InlineAlert variant="success" title="Success" description="Operation completed." />
      <InlineAlert variant="warning" title="Warning" description="Proceed with caution." />
      <InlineAlert variant="error" title="Error" description="Something went wrong." />
    </div>
}`,...(A=(S=c.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};const J=["Info","Success","Warning","Error","Dismissible","AllVariants"];export{c as AllVariants,l as Dismissible,o as Error,t as Info,n as Success,a as Warning,J as __namedExportsOrder,G as default};
