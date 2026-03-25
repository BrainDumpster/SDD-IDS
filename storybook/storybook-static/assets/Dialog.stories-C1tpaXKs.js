import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{u as T,D as N,a as E,b as R,c as k,d as z,e as S,f as I}from"./DialogTrigger-D9514YRZ.js";import{r as w}from"./index-JhL3uwfD.js";import{b as q}from"./useRenderElement-RsBRv27X.js";import{u as W}from"./useBaseUiId-BLkZpPk-.js";import{B as r}from"./Button-BI0SS6yn.js";import{T as m}from"./TextInput-CPgAHyLh.js";import"./popupStateMapping-CQ_CO6ir.js";import"./floating-ui.utils.dom-Bqtipqz1.js";import"./useTimeout-CmC-sU71.js";import"./useOnMount-B6x4EhYE.js";import"./useId-B8m7M0JZ.js";import"./useIsoLayoutEffect-CnFbsThY.js";import"./createBaseUIEventDetails-ByMWqkvP.js";import"./event-BOP_-AC1.js";import"./detectBrowser-5lYXwz_k.js";import"./element-DmyaY4bW.js";import"./constants-CRqqCNE_.js";import"./useOpenChangeComplete-icb77CBH.js";import"./useValueAsRef-DtqLqviz.js";import"./index-BPftEo5x.js";import"./index-hLVmTiZX.js";import"./useAnimationFrame-D1xspdTI.js";import"./useButton-BjJFDiZL.js";import"./composite-DOn_YXxX.js";import"./InternalBackdrop-Dtv5M0RU.js";import"./owner-CQsS7OFZ.js";import"./visuallyHidden-CbwUG2x5.js";import"./inertValue-DAA6fc98.js";import"./useOpenInteractionType-BbfBqJxI.js";import"./useSyncedFloatingRootContext-D5qHrOP0.js";import"./useTransitionStatus-xXKl72NO.js";import"./useControlled-BvBqJoZQ.js";import"./LabelableContext-CDu1x6PI.js";import"./useLabelableId-CZJ8eNlp.js";import"./FieldsetRootContext-C7uOxk4V.js";const L=w.forwardRef(function(n,i){const{render:d,className:c,id:D,...B}=n,{store:C}=T(),p=W(D);return C.useSyncedValueWithCleanup("descriptionElementId",p),q("p",n,{ref:i,props:[{id:p},B]})}),O="_triggerReset_173fb_1",P="_backdrop_173fb_6",A="_popup_173fb_13",F="_sm_173fb_28",M="_md_173fb_29",Q="_lg_173fb_30",V="_header_173fb_32",Y="_title_173fb_40",$="_close_173fb_47",U="_description_173fb_68",G="_body_173fb_75",t={triggerReset:O,backdrop:P,popup:A,sm:F,md:M,lg:Q,header:V,title:Y,close:$,description:U,body:G};function b({trigger:l,title:n,description:i,children:d,size:c="md"}){return e.jsxs(N,{children:[e.jsx(E,{className:t.triggerReset,children:l}),e.jsxs(R,{children:[e.jsx(k,{className:t.backdrop}),e.jsxs(z,{className:`${t.popup} ${t[c]}`,children:[e.jsxs("div",{className:t.header,children:[e.jsx(S,{className:t.title,children:n}),e.jsx(I,{className:t.close,"aria-label":"Close",children:e.jsx(H,{})})]}),i&&e.jsx(L,{className:t.description,children:i}),e.jsx("div",{className:t.body,children:d})]})]})]})}function H(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M12 4L4 12M4 4L12 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}b.__docgenInfo={description:"",methods:[],displayName:"Dialog",props:{trigger:{required:!0,tsType:{name:"ReactNode"},description:""},title:{required:!0,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}}}};const Se={title:"Synapse/Dialog",component:b,argTypes:{size:{control:"select",options:["sm","md","lg"]}}},o={args:{trigger:e.jsx(r,{children:"Open Dialog"}),title:"Confirm action",description:"Are you sure you want to proceed? This action cannot be undone.",children:e.jsxs("div",{style:{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16},children:[e.jsx(r,{variant:"secondary",children:"Cancel"}),e.jsx(r,{variant:"danger",children:"Delete"})]})}},s={args:{trigger:e.jsx(r,{children:"Edit profile"}),title:"Edit profile",size:"md",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[e.jsx(m,{label:"Display name",placeholder:"Enter your name"}),e.jsx(m,{label:"Email",type:"email",placeholder:"you@example.com"}),e.jsxs("div",{style:{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8},children:[e.jsx(r,{variant:"secondary",children:"Cancel"}),e.jsx(r,{children:"Save changes"})]})]})}},a={args:{trigger:e.jsx(r,{variant:"secondary",children:"Quick confirm"}),title:"Delete item?",size:"sm",children:e.jsxs("div",{style:{display:"flex",gap:8,justifyContent:"flex-end"},children:[e.jsx(r,{variant:"secondary",size:"sm",children:"No"}),e.jsx(r,{variant:"danger",size:"sm",children:"Yes, delete"})]})}};var u,g,f;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    trigger: <Button>Open Dialog</Button>,
    title: "Confirm action",
    description: "Are you sure you want to proceed? This action cannot be undone.",
    children: <div style={{
      display: "flex",
      gap: 8,
      justifyContent: "flex-end",
      marginTop: 16
    }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </div>
  }
}`,...(f=(g=o.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var x,y,h;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    trigger: <Button>Edit profile</Button>,
    title: "Edit profile",
    size: "md",
    children: <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16
    }}>
        <TextInput label="Display name" placeholder="Enter your name" />
        <TextInput label="Email" type="email" placeholder="you@example.com" />
        <div style={{
        display: "flex",
        gap: 8,
        justifyContent: "flex-end",
        marginTop: 8
      }}>
          <Button variant="secondary">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </div>
  }
}`,...(h=(y=s.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var _,j,v;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    trigger: <Button variant="secondary">Quick confirm</Button>,
    title: "Delete item?",
    size: "sm",
    children: <div style={{
      display: "flex",
      gap: 8,
      justifyContent: "flex-end"
    }}>
        <Button variant="secondary" size="sm">No</Button>
        <Button variant="danger" size="sm">Yes, delete</Button>
      </div>
  }
}`,...(v=(j=a.parameters)==null?void 0:j.docs)==null?void 0:v.source}}};const Ie=["Default","WithForm","Small"];export{o as Default,a as Small,s as WithForm,Ie as __namedExportsOrder,Se as default};
