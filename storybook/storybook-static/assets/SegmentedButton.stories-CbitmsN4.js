import{j as m}from"./jsx-runtime-D_zvdyIk.js";import{r as a}from"./index-JhL3uwfD.js";import{u as z}from"./floating-ui.utils.dom-Bqtipqz1.js";import{u as F}from"./useControlled-BvBqJoZQ.js";import{f as U,b as H}from"./useRenderElement-RsBRv27X.js";import{C as X}from"./CompositeRoot-D9iinhX9.js";import{u as Y}from"./ToolbarRootContext-Bgv4qXVA.js";import{a as Z}from"./useButton-BjJFDiZL.js";import{C as $}from"./CompositeItem-DT--TAqE.js";import{c as D,n as ee}from"./createBaseUIEventDetails-ByMWqkvP.js";import"./useCompositeListItem-D8FbfHc-.js";import"./useIsoLayoutEffect-CnFbsThY.js";import"./isElementDisabled-CwHw_lZC.js";import"./composite-DOn_YXxX.js";import"./composite-DI-9wL89.js";import"./floating-ui.utils-D9tMzej3.js";import"./event-BOP_-AC1.js";import"./detectBrowser-5lYXwz_k.js";import"./constants-CRqqCNE_.js";import"./DirectionContext-FZl-zfcF.js";import"./useCompositeItem-D9m1dI9T.js";const J=a.createContext(void 0);function te(t=!0){const o=a.useContext(J);if(o===void 0&&!t)throw new Error(U(7));return o}let oe=(function(t){return t.disabled="data-disabled",t.orientation="data-orientation",t.multiple="data-multiple",t})({});const w={multiple(t){return t?{[oe.multiple]:""}:null}},se=a.forwardRef(function(o,i){const{defaultValue:s,disabled:p=!1,loopFocus:k=!0,onValueChange:_,orientation:r="horizontal",multiple:f=!1,value:v,className:N,render:E,...T}=o,u=Y(),b=a.useMemo(()=>{if(v===void 0)return s??[]},[v,s]),e=((u==null?void 0:u.disabled)??!1)||p,[l,G]=F({controlled:v,default:b,name:"ToggleGroup",state:"value"}),c=z((g,y,h)=>{let n;if(f?(n=l.slice(),y?n.push(g):n.splice(l.indexOf(g),1)):n=y?[g]:[],Array.isArray(n)){if(_==null||_(n,h),h.isCanceled)return;G(n)}}),d=a.useMemo(()=>({disabled:e,multiple:f,orientation:r}),[e,r,f]),M=a.useMemo(()=>({disabled:e,orientation:r,setGroupValue:c,value:l}),[e,r,c,l]),x={role:"group"},O=H("div",o,{enabled:!!u,state:d,ref:i,props:[x,T],stateAttributesMapping:w});return m.jsx(J.Provider,{value:M,children:u?O:m.jsx(X,{render:E,className:N,state:d,refs:[i],props:[x,T],stateAttributesMapping:w,loopFocus:k})})}),ne=a.forwardRef(function(o,i){const{className:s,defaultPressed:p=!1,disabled:k=!1,form:_,onPressedChange:r,pressed:f,render:v,type:N,value:E,nativeButton:T=!0,...u}=o,b=E??"",e=te(),l=(e==null?void 0:e.value)??[],G=e?void 0:p,c=(k||(e==null?void 0:e.disabled))??!1,[d,M]=F({controlled:e&&b?(l==null?void 0:l.indexOf(b))>-1:f,default:G,name:"Toggle",state:"pressed"}),x=z((C,P)=>{var S;(S=e==null?void 0:e.setGroupValue)==null||S.call(e,b,C,P),r==null||r(C,P)}),{getButtonProps:O,buttonRef:g}=Z({disabled:c,native:T}),y=a.useMemo(()=>({disabled:c,pressed:d}),[c,d]),h=[g,i],n=[{"aria-pressed":d,onClick(C){const P=!d,S=D(ee,C.nativeEvent);x(P,S),!S.isCanceled&&M(P)}},u,O],Q=H("button",o,{enabled:!e,state:y,ref:h,props:n});return e?m.jsx($,{tag:"button",render:v,className:s,state:y,refs:h,props:n}):Q}),ae="_root_1ioo5_1",re="_button_1ioo5_9",le="_selected_1ioo5_31",V={root:ae,button:re,selected:le};function R({options:t,value:o,onChange:i}){return m.jsx(se,{className:V.root,value:o?[o]:[],onValueChange:s=>{s.length>0&&i&&i(s[s.length-1])},children:t.map(s=>m.jsx(ne,{value:s.value,className:p=>[V.button,p.pressed?V.selected:""].filter(Boolean).join(" "),children:s.label},s.value))})}R.__docgenInfo={description:"",methods:[],displayName:"SegmentedButton",props:{options:{required:!0,tsType:{name:"Array",elements:[{name:"SegmentedOption"}],raw:"SegmentedOption[]"},description:""},value:{required:!1,tsType:{name:"string"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""}}};const Ee={title:"Synapse/SegmentedButton",component:R},j={render:()=>{const[t,o]=a.useState("monthly");return m.jsx(R,{options:[{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"monthly",label:"Monthly"}],value:t,onChange:o})}},B={args:{options:[{value:"list",label:"List"},{value:"grid",label:"Grid"},{value:"kanban",label:"Kanban"}],value:"grid"}};var q,A,I;j.parameters={...j.parameters,docs:{...(q=j.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("monthly");
    return <SegmentedButton options={[{
      value: "daily",
      label: "Daily"
    }, {
      value: "weekly",
      label: "Weekly"
    }, {
      value: "monthly",
      label: "Monthly"
    }]} value={value} onChange={setValue} />;
  }
}`,...(I=(A=j.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var K,L,W;B.parameters={...B.parameters,docs:{...(K=B.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "list",
      label: "List"
    }, {
      value: "grid",
      label: "Grid"
    }, {
      value: "kanban",
      label: "Kanban"
    }],
    value: "grid"
  }
}`,...(W=(L=B.parameters)==null?void 0:L.docs)==null?void 0:W.source}}};const Ge=["ThreeOptions","Preselected"];export{B as Preselected,j as ThreeOptions,Ge as __namedExportsOrder,Ee as default};
