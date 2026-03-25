import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./index-JhL3uwfD.js";const k="_root_9f0o4_1",v="_disabled_9f0o4_16",D="_textarea_9f0o4_21",w="_send_9f0o4_44",r={root:k,disabled:v,textarea:D,send:w};function C({onSend:s,placeholder:u="Type a message...",disabled:d=!1}){const[t,m]=c.useState(""),i=c.useCallback(()=>{const e=t.trim();e&&s&&(s(e),m(""))},[t,s]),j=c.useCallback(e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),i())},[i]);return a.jsxs("div",{className:[r.root,d?r.disabled:""].filter(Boolean).join(" "),children:[a.jsx("textarea",{className:r.textarea,value:t,onChange:e=>m(e.target.value),onKeyDown:j,placeholder:u,disabled:d,rows:1,"aria-label":u}),a.jsx("button",{type:"button",className:r.send,onClick:i,disabled:d||!t.trim(),"aria-label":"Send message",children:a.jsx(L,{})})]})}function L(){return a.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:a.jsx("path",{d:"M3 10L17 3L10 17L9 11L3 10Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})}C.__docgenInfo={description:"",methods:[],displayName:"ChatInputBox",props:{onSend:{required:!1,tsType:{name:"signature",type:"function",raw:"(message: string) => void",signature:{arguments:[{type:{name:"string"},name:"message"}],return:{name:"void"}}},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Type a message..."',computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const I={title:"Synapse/ChatInputBox",component:C},o={args:{onSend:s=>alert(`Sent: ${s}`)}},n={args:{placeholder:"Ask a question...",onSend:s=>console.log(s)}},l={args:{disabled:!0,placeholder:"Chat is disabled"}};var p,g,f;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    onSend: (msg: string) => alert(\`Sent: \${msg}\`)
  }
}`,...(f=(g=o.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var h,x,b;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    placeholder: "Ask a question...",
    onSend: (msg: string) => console.log(msg)
  }
}`,...(b=(x=n.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var _,y,S;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: "Chat is disabled"
  }
}`,...(S=(y=l.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};const T=["Default","CustomPlaceholder","Disabled"];export{n as CustomPlaceholder,o as Default,l as Disabled,T as __namedExportsOrder,I as default};
