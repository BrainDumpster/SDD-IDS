import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-JhL3uwfD.js";import{u as X}from"./useValueAsRef-DtqLqviz.js";import{f as C,v as Y}from"./valueToPercent-CmxdyyhM.js";import{f as Z,b as w}from"./useRenderElement-RsBRv27X.js";import"./useIsoLayoutEffect-CnFbsThY.js";const G=i.createContext(void 0);function R(){const e=i.useContext(G);if(e===void 0)throw new Error(Z(51));return e}let N=(function(e){return e.complete="data-complete",e.indeterminate="data-indeterminate",e.progressing="data-progressing",e})({});const S={status(e){return e==="progressing"?{[N.progressing]:""}:e==="complete"?{[N.complete]:""}:e==="indeterminate"?{[N.indeterminate]:""}:null}};function ee(e,r,a){return e==null?"":a?C(e,r,a):C(e/100,r,{style:"percent"})}function re(e,r){return r==null?"indeterminate progress":e||`${r}%`}const te=i.forwardRef(function(r,a){const{format:c,getAriaValueText:p=re,locale:n,max:o=100,min:l=0,value:t,render:h,className:m,...f}=r,[y,T]=i.useState(),H=X(c);let g="indeterminate";Number.isFinite(t)&&(g=t===o?"complete":"progressing");const P=ee(t,n,H.current),j=i.useMemo(()=>({status:g}),[g]),J={"aria-labelledby":y,"aria-valuemax":o,"aria-valuemin":l,"aria-valuenow":t??void 0,"aria-valuetext":p(P,t),role:"progressbar"},K=i.useMemo(()=>({formattedValue:P,max:o,min:l,setLabelId:T,state:j,status:g,value:t}),[P,o,l,T,j,g,t]),Q=w("div",r,{state:j,ref:a,props:[J,f],stateAttributesMapping:S});return s.jsx(G.Provider,{value:K,children:Q})}),ae=i.forwardRef(function(r,a){const{render:c,className:p,...n}=r,{state:o}=R();return w("div",r,{state:o,ref:a,props:n,stateAttributesMapping:S})}),se=i.forwardRef(function(r,a){const{render:c,className:p,...n}=r,{max:o,min:l,value:t,state:h}=R(),m=Number.isFinite(t)&&t!==null?Y(t,l,o):null,f=i.useCallback(()=>m==null?{}:{insetInlineStart:0,height:"inherit",width:`${m}%`},[m]);return w("div",r,{state:h,ref:a,props:[{style:f()},n],stateAttributesMapping:S})}),ne=i.forwardRef(function(r,a){const{className:c,render:p,children:n,...o}=r,{value:l,formattedValue:t,state:h}=R(),m=l==null?"indeterminate":t,f=l==null?null:t;return w("span",r,{state:h,ref:a,props:[{"aria-hidden":!0,children:typeof n=="function"?n(m,l):f},o],stateAttributesMapping:S})}),oe="_root_1h9lt_1",le="_meta_1h9lt_8",ie="_label_1h9lt_14",ue="_value_1h9lt_20",ce="_track_1h9lt_25",me="_sm_1h9lt_32",de="_md_1h9lt_33",pe="_indicator_1h9lt_35",u={root:oe,meta:le,label:ie,value:ue,track:ce,sm:me,md:de,indicator:pe};function d({value:e,label:r,showValue:a=!1,size:c="md"}){return s.jsxs(te,{className:u.root,value:e,children:[(r||a)&&s.jsxs("div",{className:u.meta,children:[r&&s.jsx("span",{className:u.label,children:r}),a&&s.jsx(ne,{className:u.value,children:(p,n)=>`${Math.round(n??0)}%`})]}),s.jsx(ae,{className:`${u.track} ${u[c]}`,children:s.jsx(se,{className:u.indicator})})]})}d.__docgenInfo={description:"",methods:[],displayName:"ProgressBar",props:{value:{required:!0,tsType:{name:"number"},description:""},label:{required:!1,tsType:{name:"string"},description:""},showValue:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'}]},description:"",defaultValue:{value:'"md"',computed:!1}}}};const _e={title:"Synapse/ProgressBar",component:d,argTypes:{value:{control:{type:"range",min:0,max:100}},size:{control:"select",options:["sm","md"]},showValue:{control:"boolean"}}},v={args:{value:60}},x={args:{value:45,label:"Uploading files...",showValue:!0}},b={args:{value:100,label:"Upload complete",showValue:!0}},_={args:{value:30,size:"sm"}},V={render:()=>s.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16,maxWidth:400},children:[s.jsx(d,{value:25,label:"Step 1 of 4",showValue:!0}),s.jsx(d,{value:50,label:"Step 2 of 4",showValue:!0}),s.jsx(d,{value:75,label:"Step 3 of 4",showValue:!0}),s.jsx(d,{value:100,label:"Complete",showValue:!0})]})};var M,k,A;v.parameters={...v.parameters,docs:{...(M=v.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    value: 60
  }
}`,...(A=(k=v.parameters)==null?void 0:k.docs)==null?void 0:A.source}}};var B,E,I;x.parameters={...x.parameters,docs:{...(B=x.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    value: 45,
    label: "Uploading files...",
    showValue: true
  }
}`,...(I=(E=x.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var $,q,z;b.parameters={...b.parameters,docs:{...($=b.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    value: 100,
    label: "Upload complete",
    showValue: true
  }
}`,...(z=(q=b.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var D,U,W;_.parameters={..._.parameters,docs:{...(D=_.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    value: 30,
    size: "sm"
  }
}`,...(W=(U=_.parameters)==null?void 0:U.docs)==null?void 0:W.source}}};var L,F,O;V.parameters={...V.parameters,docs:{...(L=V.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxWidth: 400
  }}>
      <ProgressBar value={25} label="Step 1 of 4" showValue />
      <ProgressBar value={50} label="Step 2 of 4" showValue />
      <ProgressBar value={75} label="Step 3 of 4" showValue />
      <ProgressBar value={100} label="Complete" showValue />
    </div>
}`,...(O=(F=V.parameters)==null?void 0:F.docs)==null?void 0:O.source}}};const Ve=["Default","WithLabel","Complete","Small","Steps"];export{b as Complete,v as Default,_ as Small,V as Steps,x as WithLabel,Ve as __namedExportsOrder,_e as default};
