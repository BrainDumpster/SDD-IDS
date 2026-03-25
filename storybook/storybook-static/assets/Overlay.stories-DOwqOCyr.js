import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{D as _,a as b,b as D,c as T,d as w,e as B,f as C}from"./DialogTrigger-D9514YRZ.js";import{B as t}from"./Button-BI0SS6yn.js";import{T as n}from"./TextInput-CPgAHyLh.js";import"./index-JhL3uwfD.js";import"./useRenderElement-RsBRv27X.js";import"./popupStateMapping-CQ_CO6ir.js";import"./floating-ui.utils.dom-Bqtipqz1.js";import"./useTimeout-CmC-sU71.js";import"./useOnMount-B6x4EhYE.js";import"./useId-B8m7M0JZ.js";import"./useIsoLayoutEffect-CnFbsThY.js";import"./createBaseUIEventDetails-ByMWqkvP.js";import"./event-BOP_-AC1.js";import"./detectBrowser-5lYXwz_k.js";import"./element-DmyaY4bW.js";import"./constants-CRqqCNE_.js";import"./useOpenChangeComplete-icb77CBH.js";import"./useValueAsRef-DtqLqviz.js";import"./index-BPftEo5x.js";import"./index-hLVmTiZX.js";import"./useAnimationFrame-D1xspdTI.js";import"./useButton-BjJFDiZL.js";import"./composite-DOn_YXxX.js";import"./InternalBackdrop-Dtv5M0RU.js";import"./owner-CQsS7OFZ.js";import"./visuallyHidden-CbwUG2x5.js";import"./inertValue-DAA6fc98.js";import"./useOpenInteractionType-BbfBqJxI.js";import"./useSyncedFloatingRootContext-D5qHrOP0.js";import"./useTransitionStatus-xXKl72NO.js";import"./useBaseUiId-BLkZpPk-.js";import"./useControlled-BvBqJoZQ.js";import"./LabelableContext-CDu1x6PI.js";import"./useLabelableId-CZJ8eNlp.js";import"./FieldsetRootContext-C7uOxk4V.js";const N="_triggerReset_1i9ro_1",P="_backdrop_1i9ro_6",I="_panel_1i9ro_13",E="_header_1i9ro_32",O="_title_1i9ro_41",k="_close_1i9ro_48",R="_body_1i9ro_69",r={triggerReset:N,backdrop:P,panel:I,header:E,title:O,close:k,body:R};function h({trigger:y,title:f,children:v,width:j="400px"}){return e.jsxs(_,{children:[e.jsx(b,{className:r.triggerReset,children:y}),e.jsxs(D,{children:[e.jsx(T,{className:r.backdrop}),e.jsxs(w,{className:r.panel,style:{width:j},children:[e.jsxs("div",{className:r.header,children:[e.jsx(B,{className:r.title,children:f}),e.jsx(C,{className:r.close,"aria-label":"Close",children:e.jsx(L,{})})]}),e.jsx("div",{className:r.body,children:v})]})]})]})}function L(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M12 4L4 12M4 4L12 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}h.__docgenInfo={description:"",methods:[],displayName:"Overlay",props:{trigger:{required:!0,tsType:{name:"ReactNode"},description:""},title:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},width:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"400px"',computed:!1}}}};const fe={title:"Synapse/Overlay",component:h,argTypes:{width:{control:"text"}}},i={args:{trigger:e.jsx(t,{children:"Open Overlay"}),title:"Details Panel",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[e.jsx("p",{style:{margin:0,color:"var(--color-text-neutral)"},children:"This is a slide-in panel from the right side of the screen. It's useful for viewing details or editing forms without leaving the current page context."}),e.jsx(n,{label:"Name",placeholder:"Enter name"}),e.jsx(n,{label:"Description",placeholder:"Enter description"}),e.jsxs("div",{style:{display:"flex",gap:8,marginTop:8},children:[e.jsx(t,{size:"sm",children:"Save"}),e.jsx(t,{variant:"secondary",size:"sm",children:"Cancel"})]})]})}},a={args:{trigger:e.jsx(t,{variant:"secondary",children:"Open Wide Panel"}),title:"Configuration",width:"560px",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[e.jsx("p",{style:{margin:0,color:"var(--color-text-neutral)"},children:"A wider panel for more complex content layouts."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16},children:[e.jsx(n,{label:"First name",placeholder:"First"}),e.jsx(n,{label:"Last name",placeholder:"Last"}),e.jsx(n,{label:"Email",placeholder:"Email"}),e.jsx(n,{label:"Phone",placeholder:"Phone"})]})]})}},o={args:{trigger:e.jsx(t,{variant:"ghost",children:"Open Narrow"}),title:"Quick Actions",width:"320px",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsx(t,{variant:"secondary",style:{justifyContent:"flex-start"},children:"Export data"}),e.jsx(t,{variant:"secondary",style:{justifyContent:"flex-start"},children:"Import data"}),e.jsx(t,{variant:"secondary",style:{justifyContent:"flex-start"},children:"Download report"})]})}};var s,l,p;i.parameters={...i.parameters,docs:{...(s=i.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    trigger: <Button>Open Overlay</Button>,
    title: "Details Panel",
    children: <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16
    }}>
        <p style={{
        margin: 0,
        color: "var(--color-text-neutral)"
      }}>
          This is a slide-in panel from the right side of the screen.
          It's useful for viewing details or editing forms without leaving the
          current page context.
        </p>
        <TextInput label="Name" placeholder="Enter name" />
        <TextInput label="Description" placeholder="Enter description" />
        <div style={{
        display: "flex",
        gap: 8,
        marginTop: 8
      }}>
          <Button size="sm">Save</Button>
          <Button variant="secondary" size="sm">Cancel</Button>
        </div>
      </div>
  }
}`,...(p=(l=i.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var d,c,m;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    trigger: <Button variant="secondary">Open Wide Panel</Button>,
    title: "Configuration",
    width: "560px",
    children: <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 16
    }}>
        <p style={{
        margin: 0,
        color: "var(--color-text-neutral)"
      }}>
          A wider panel for more complex content layouts.
        </p>
        <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16
      }}>
          <TextInput label="First name" placeholder="First" />
          <TextInput label="Last name" placeholder="Last" />
          <TextInput label="Email" placeholder="Email" />
          <TextInput label="Phone" placeholder="Phone" />
        </div>
      </div>
  }
}`,...(m=(c=a.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,x,g;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    trigger: <Button variant="ghost">Open Narrow</Button>,
    title: "Quick Actions",
    width: "320px",
    children: <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 12
    }}>
        <Button variant="secondary" style={{
        justifyContent: "flex-start"
      }}>
          Export data
        </Button>
        <Button variant="secondary" style={{
        justifyContent: "flex-start"
      }}>
          Import data
        </Button>
        <Button variant="secondary" style={{
        justifyContent: "flex-start"
      }}>
          Download report
        </Button>
      </div>
  }
}`,...(g=(x=o.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};const ve=["Default","WidePanel","NarrowPanel"];export{i as Default,o as NarrowPanel,a as WidePanel,ve as __namedExportsOrder,fe as default};
