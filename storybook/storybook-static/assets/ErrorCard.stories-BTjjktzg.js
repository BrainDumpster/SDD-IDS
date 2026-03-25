import{j as e}from"./jsx-runtime-D_zvdyIk.js";const g="_card_159ra_1",y="_accent_159ra_9",_="_body_159ra_18",h="_iconWrapper_159ra_25",x="_content_159ra_31",j="_title_159ra_37",k="_message_159ra_46",b="_action_159ra_54",r={card:g,accent:y,body:_,iconWrapper:h,content:x,title:j,message:k,action:b};function u({title:m,message:p,action:a}){return e.jsxs("div",{className:r.card,role:"alert",children:[e.jsx("div",{className:r.accent}),e.jsxs("div",{className:r.body,children:[e.jsx("div",{className:r.iconWrapper,children:e.jsx(v,{})}),e.jsxs("div",{className:r.content,children:[e.jsx("h3",{className:r.title,children:m}),e.jsx("p",{className:r.message,children:p}),a&&e.jsx("button",{type:"button",className:r.action,onClick:a.onClick,children:a.label})]})]})]})}function v(){return e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M12 8V12M12 16H12.01",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]})}u.__docgenInfo={description:"",methods:[],displayName:"ErrorCard",props:{title:{required:!0,tsType:{name:"string"},description:""},message:{required:!0,tsType:{name:"string"},description:""},action:{required:!1,tsType:{name:"signature",type:"object",raw:"{ label: string; onClick: () => void }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}},description:""}}};const C={title:"Synapse/ErrorCard",component:u},t={args:{title:"404 — Page Not Found",message:"The page you are looking for does not exist or has been moved."}},n={args:{title:"Something went wrong",message:"An unexpected error occurred while loading your data. Please try again.",action:{label:"Retry",onClick:()=>alert("Retrying...")}}};var o,s,i;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    title: "404 — Page Not Found",
    message: "The page you are looking for does not exist or has been moved."
  }
}`,...(i=(s=t.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};var c,d,l;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    title: "Something went wrong",
    message: "An unexpected error occurred while loading your data. Please try again.",
    action: {
      label: "Retry",
      onClick: () => alert("Retrying...")
    }
  }
}`,...(l=(d=n.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const f=["NotFound","GenericWithRetry"];export{n as GenericWithRetry,t as NotFound,f as __namedExportsOrder,C as default};
