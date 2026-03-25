import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{T as r}from"./TextInput-CPgAHyLh.js";import"./index-JhL3uwfD.js";import"./floating-ui.utils.dom-Bqtipqz1.js";import"./useRenderElement-RsBRv27X.js";import"./useControlled-BvBqJoZQ.js";import"./useIsoLayoutEffect-CnFbsThY.js";import"./LabelableContext-CDu1x6PI.js";import"./index-BPftEo5x.js";import"./index-hLVmTiZX.js";import"./useLabelableId-CZJ8eNlp.js";import"./useBaseUiId-BLkZpPk-.js";import"./useId-B8m7M0JZ.js";import"./createBaseUIEventDetails-ByMWqkvP.js";import"./FieldsetRootContext-C7uOxk4V.js";import"./useTimeout-CmC-sU71.js";import"./useOnMount-B6x4EhYE.js";import"./element-DmyaY4bW.js";import"./detectBrowser-5lYXwz_k.js";import"./constants-CRqqCNE_.js";const X={title:"Synapse/TextInput",component:r,argTypes:{size:{control:"select",options:["sm","md","lg"]},disabled:{control:"boolean"},invalid:{control:"boolean"}}},a={args:{label:"Email",placeholder:"you@example.com"}},s={args:{label:"Username",placeholder:"Enter username",helperText:"Must be 3-20 characters"}},l={args:{label:"Password",type:"password",invalid:!0,errorText:"Password must be at least 8 characters"}},o={args:{label:"Read only",value:"Cannot edit",disabled:!0}},t={args:{label:"Compact",size:"sm",placeholder:"Small input"}},n={args:{label:"Full name",size:"lg",placeholder:"Large input"}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16,maxWidth:360},children:[e.jsx(r,{label:"First name",placeholder:"John"}),e.jsx(r,{label:"Last name",placeholder:"Doe"}),e.jsx(r,{label:"Email",placeholder:"john@example.com",type:"email",helperText:"We'll never share your email"}),e.jsx(r,{label:"Password",type:"password",invalid:!0,errorText:"Required field"})]})};var m,i,c;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Email",
    placeholder: "you@example.com"
  }
}`,...(c=(i=a.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var d,u,h;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    label: "Username",
    placeholder: "Enter username",
    helperText: "Must be 3-20 characters"
  }
}`,...(h=(u=s.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var x,b,g;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Password",
    type: "password",
    invalid: true,
    errorText: "Password must be at least 8 characters"
  }
}`,...(g=(b=l.parameters)==null?void 0:b.docs)==null?void 0:g.source}}};var y,T,v;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: "Read only",
    value: "Cannot edit",
    disabled: true
  }
}`,...(v=(T=o.parameters)==null?void 0:T.docs)==null?void 0:v.source}}};var E,S,f;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: "Compact",
    size: "sm",
    placeholder: "Small input"
  }
}`,...(f=(S=t.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var w,j,D;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    label: "Full name",
    size: "lg",
    placeholder: "Large input"
  }
}`,...(D=(j=n.parameters)==null?void 0:j.docs)==null?void 0:D.source}}};var W,F,I;p.parameters={...p.parameters,docs:{...(W=p.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxWidth: 360
  }}>
      <TextInput label="First name" placeholder="John" />
      <TextInput label="Last name" placeholder="Doe" />
      <TextInput label="Email" placeholder="john@example.com" type="email" helperText="We'll never share your email" />
      <TextInput label="Password" type="password" invalid errorText="Required field" />
    </div>
}`,...(I=(F=p.parameters)==null?void 0:F.docs)==null?void 0:I.source}}};const Y=["Default","WithHelper","WithError","Disabled","Small","Large","FormExample"];export{a as Default,o as Disabled,p as FormExample,n as Large,t as Small,l as WithError,s as WithHelper,Y as __namedExportsOrder,X as default};
