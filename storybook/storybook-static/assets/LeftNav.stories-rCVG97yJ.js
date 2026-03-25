import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as f,a as _,b as k}from"./CollapsiblePanel-D9oM1ScQ.js";import"./index-JhL3uwfD.js";import"./floating-ui.utils.dom-Bqtipqz1.js";import"./useRenderElement-RsBRv27X.js";import"./useCollapsiblePanel-B6i-UWrt.js";import"./useControlled-BvBqJoZQ.js";import"./useIsoLayoutEffect-CnFbsThY.js";import"./useBaseUiId-BLkZpPk-.js";import"./useId-B8m7M0JZ.js";import"./createBaseUIEventDetails-ByMWqkvP.js";import"./useOpenChangeComplete-icb77CBH.js";import"./useValueAsRef-DtqLqviz.js";import"./index-BPftEo5x.js";import"./index-hLVmTiZX.js";import"./useAnimationFrame-D1xspdTI.js";import"./useOnMount-B6x4EhYE.js";import"./useTransitionStatus-xXKl72NO.js";import"./useButton-BjJFDiZL.js";const y="_nav_1dnmr_1",L="_expanded_1dnmr_12",b="_collapsed_1dnmr_17",C="_group_1dnmr_24",N="_groupLabel_1dnmr_28",w="_groupTrigger_1dnmr_39",M="_groupIcon_1dnmr_67",I="_groupOpen_1dnmr_73",T="_groupPanel_1dnmr_77",W="_groupTitle_1dnmr_81",P="_itemList_1dnmr_87",S="_link_1dnmr_96",V="_linkActive_1dnmr_126",B="_icon_1dnmr_136",H="_label_1dnmr_146",o={nav:y,expanded:L,collapsed:b,group:C,groupLabel:N,groupTrigger:w,groupIcon:M,groupOpen:I,groupPanel:T,groupTitle:W,itemList:P,link:S,linkActive:V,icon:B,label:H};function g({groups:r,collapsed:n=!1,className:t,...s}){return e.jsx("aside",{className:[o.nav,n?o.collapsed:o.expanded,t].filter(Boolean).join(" "),...s,children:e.jsx("nav",{"aria-label":"Side navigation",children:r.map((j,v)=>e.jsx(A,{group:j,collapsed:n},v))})})}function A({group:r,collapsed:n}){return r.collapsible&&!n?e.jsxs(f,{defaultOpen:!0,className:o.group,children:[e.jsxs(_,{className:t=>[o.groupTrigger,t.open?o.groupOpen:""].filter(Boolean).join(" "),children:[e.jsx("span",{className:o.groupTitle,children:r.title}),e.jsx(O,{className:o.groupIcon})]}),e.jsx(k,{className:o.groupPanel,children:e.jsx("ul",{className:o.itemList,children:r.items.map((t,s)=>e.jsx(a,{item:t,collapsed:n},s))})})]}):e.jsxs("div",{className:o.group,children:[!n&&e.jsx("span",{className:o.groupLabel,children:r.title}),e.jsx("ul",{className:o.itemList,children:r.items.map((t,s)=>e.jsx(a,{item:t,collapsed:n},s))})]})}function a({item:r,collapsed:n}){return e.jsx("li",{children:e.jsxs("a",{href:r.href,className:[o.link,r.active?o.linkActive:""].filter(Boolean).join(" "),"aria-current":r.active?"page":void 0,title:n?r.label:void 0,children:[r.icon&&e.jsx("span",{className:o.icon,children:r.icon}),!n&&e.jsx("span",{className:o.label,children:r.label})]})})}function O({className:r}){return e.jsx("svg",{className:r,width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M4 6L8 10L12 6",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}g.__docgenInfo={description:"",methods:[],displayName:"LeftNav",props:{groups:{required:!0,tsType:{name:"Array",elements:[{name:"NavGroup"}],raw:"NavGroup[]"},description:""},collapsed:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}},composes:["ComponentProps"]};const ce={title:"Synapse/LeftNav",component:g,argTypes:{collapsed:{control:"boolean"}},parameters:{layout:"fullscreen"}};function R(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M2 8L8 2L14 8V14H10V10H6V14H2V8Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})})}function E(){return e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"2",y:"8",width:"3",height:"6",stroke:"currentColor",strokeWidth:"1.5"}),e.jsx("rect",{x:"6.5",y:"4",width:"3",height:"10",stroke:"currentColor",strokeWidth:"1.5"}),e.jsx("rect",{x:"11",y:"2",width:"3",height:"12",stroke:"currentColor",strokeWidth:"1.5"})]})}function G(){return e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"8",cy:"8",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"}),e.jsx("path",{d:"M8 1V3M8 13V15M1 8H3M13 8H15M3 3L4.5 4.5M11.5 11.5L13 13M3 13L4.5 11.5M11.5 4.5L13 3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}function q(){return e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("path",{d:"M4 2H10L13 5V14H4V2Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"}),e.jsx("path",{d:"M10 2V5H13",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]})}function U(){return e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"8",cy:"5",r:"3",stroke:"currentColor",strokeWidth:"1.5"}),e.jsx("path",{d:"M2 14C2 11.5 4.5 10 8 10C11.5 10 14 11.5 14 14",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}const x=[{title:"Main",items:[{label:"Dashboard",href:"/",icon:e.jsx(R,{}),active:!0},{label:"Analytics",href:"/analytics",icon:e.jsx(E,{})},{label:"Reports",href:"/reports",icon:e.jsx(q,{})}]},{title:"Management",collapsible:!0,items:[{label:"Users",href:"/users",icon:e.jsx(U,{})},{label:"Settings",href:"/settings",icon:e.jsx(G,{})}]}],i={args:{groups:x,collapsed:!1},decorators:[r=>e.jsxs("div",{style:{height:400,display:"flex"},children:[e.jsx(r,{}),e.jsx("div",{style:{flex:1,padding:16,color:"var(--color-text-neutral)"},children:"Page content area"})]})]},l={args:{groups:x,collapsed:!0},decorators:[r=>e.jsxs("div",{style:{height:400,display:"flex"},children:[e.jsx(r,{}),e.jsx("div",{style:{flex:1,padding:16,color:"var(--color-text-neutral)"},children:"Page content area"})]})]};var c,d,p;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    groups,
    collapsed: false
  },
  decorators: [Story => <div style={{
    height: 400,
    display: "flex"
  }}>
        <Story />
        <div style={{
      flex: 1,
      padding: 16,
      color: "var(--color-text-neutral)"
    }}>
          Page content area
        </div>
      </div>]
}`,...(p=(d=i.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var u,h,m;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    groups,
    collapsed: true
  },
  decorators: [Story => <div style={{
    height: 400,
    display: "flex"
  }}>
        <Story />
        <div style={{
      flex: 1,
      padding: 16,
      color: "var(--color-text-neutral)"
    }}>
          Page content area
        </div>
      </div>]
}`,...(m=(h=l.parameters)==null?void 0:h.docs)==null?void 0:m.source}}};const de=["Expanded","CollapsedRail"];export{l as CollapsedRail,i as Expanded,de as __namedExportsOrder,ce as default};
