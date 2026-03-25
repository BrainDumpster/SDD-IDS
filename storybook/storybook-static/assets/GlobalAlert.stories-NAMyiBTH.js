import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as M}from"./index-JhL3uwfD.js";const I="_banner_q3up9_1",T="_inner_q3up9_6",z="_info_q3up9_14",E="_icon_q3up9_18",V="_success_q3up9_22",D="_warning_q3up9_30",N="_error_q3up9_38",G="_text_q3up9_53",B="_title_q3up9_61",P="_description_q3up9_68",O="_close_q3up9_74",r={banner:I,inner:T,info:z,icon:E,success:V,warning:D,error:N,text:G,title:B,description:P,close:O};function s({variant:i="info",title:d,description:u,dismissible:q=!1,onDismiss:c}){const[L,C]=M.useState(!1);if(L)return null;const W=()=>{C(!0),c==null||c()};return e.jsx("div",{className:`${r.banner} ${r[i]}`,role:"alert",children:e.jsxs("div",{className:r.inner,children:[e.jsx("span",{className:r.icon,children:e.jsx(Y,{variant:i})}),e.jsxs("div",{className:r.text,children:[e.jsx("span",{className:r.title,children:d}),u&&e.jsx("span",{className:r.description,children:u})]}),q&&e.jsx("button",{className:r.close,onClick:W,"aria-label":"Dismiss alert",type:"button",children:e.jsx($,{})})]})})}function Y({variant:i}){switch(i){case"info":return e.jsxs("svg",{width:20,height:20,viewBox:"0 0 20 20",fill:"none",children:[e.jsx("circle",{cx:"10",cy:"10",r:"9",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M10 9V14",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),e.jsx("circle",{cx:"10",cy:"6.5",r:"1",fill:"currentColor"})]});case"success":return e.jsxs("svg",{width:20,height:20,viewBox:"0 0 20 20",fill:"none",children:[e.jsx("circle",{cx:"10",cy:"10",r:"9",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M6 10L9 13L14 7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]});case"warning":return e.jsxs("svg",{width:20,height:20,viewBox:"0 0 20 20",fill:"none",children:[e.jsx("path",{d:"M10 2L19 18H1L10 2Z",stroke:"currentColor",strokeWidth:"2",strokeLinejoin:"round"}),e.jsx("path",{d:"M10 8V12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),e.jsx("circle",{cx:"10",cy:"15",r:"1",fill:"currentColor"})]});case"error":return e.jsxs("svg",{width:20,height:20,viewBox:"0 0 20 20",fill:"none",children:[e.jsx("circle",{cx:"10",cy:"10",r:"9",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M7 7L13 13M13 7L7 13",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]})}}function $(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M12 4L4 12M4 4L12 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}s.__docgenInfo={description:"",methods:[],displayName:"GlobalAlert",props:{variant:{required:!1,tsType:{name:"union",raw:'"info" | "success" | "warning" | "error"',elements:[{name:"literal",value:'"info"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'}]},description:"",defaultValue:{value:'"info"',computed:!1}},title:{required:!0,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""},dismissible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onDismiss:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const Z={title:"Synapse/GlobalAlert",component:s,argTypes:{variant:{control:"select",options:["info","success","warning","error"]},dismissible:{control:"boolean"}}},t={args:{variant:"info",title:"System maintenance scheduled",description:"The platform will be unavailable on Saturday from 2:00 AM to 4:00 AM EST.",dismissible:!0}},n={args:{variant:"success",title:"Deployment complete",description:"Version 2.4.1 has been successfully deployed to production.",dismissible:!0}},o={args:{variant:"warning",title:"API rate limit approaching",description:"You have used 90% of your monthly API quota.",dismissible:!0}},a={args:{variant:"error",title:"Service disruption detected",description:"Some users may experience intermittent errors. Our team is investigating.",dismissible:!0}},l={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:0},children:[e.jsx(s,{variant:"info",title:"Info: System update available",dismissible:!0}),e.jsx(s,{variant:"success",title:"Success: All services operational",dismissible:!0}),e.jsx(s,{variant:"warning",title:"Warning: Disk usage at 85%",dismissible:!0}),e.jsx(s,{variant:"error",title:"Error: Database connection failed",dismissible:!0})]})};var p,m,f;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: "info",
    title: "System maintenance scheduled",
    description: "The platform will be unavailable on Saturday from 2:00 AM to 4:00 AM EST.",
    dismissible: true
  }
}`,...(f=(m=t.parameters)==null?void 0:m.docs)==null?void 0:f.source}}};var h,g,x;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: "success",
    title: "Deployment complete",
    description: "Version 2.4.1 has been successfully deployed to production.",
    dismissible: true
  }
}`,...(x=(g=n.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var v,b,y;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: "warning",
    title: "API rate limit approaching",
    description: "You have used 90% of your monthly API quota.",
    dismissible: true
  }
}`,...(y=(b=o.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var _,j,k;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: "error",
    title: "Service disruption detected",
    description: "Some users may experience intermittent errors. Our team is investigating.",
    dismissible: true
  }
}`,...(k=(j=a.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var w,S,A;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 0
  }}>
      <GlobalAlert variant="info" title="Info: System update available" dismissible />
      <GlobalAlert variant="success" title="Success: All services operational" dismissible />
      <GlobalAlert variant="warning" title="Warning: Disk usage at 85%" dismissible />
      <GlobalAlert variant="error" title="Error: Database connection failed" dismissible />
    </div>
}`,...(A=(S=l.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};const F=["Info","Success","Warning","Error","AllVariants"];export{l as AllVariants,a as Error,t as Info,n as Success,o as Warning,F as __namedExportsOrder,Z as default};
