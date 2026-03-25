import{j as _}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./index-JhL3uwfD.js";import{u as de}from"./useControlled-BvBqJoZQ.js";import{u as U}from"./floating-ui.utils.dom-Bqtipqz1.js";import{f as se,b as F,a as fe}from"./useRenderElement-RsBRv27X.js";import{C as ve,u as be}from"./useCompositeListItem-D8FbfHc-.js";import{u as me}from"./DirectionContext-FZl-zfcF.js";import{u as H}from"./useIsoLayoutEffect-CnFbsThY.js";import{A as pe,C as ge}from"./CompositeRoot-D9iinhX9.js";import{o as K}from"./owner-CQsS7OFZ.js";import{u as ie}from"./useBaseUiId-BLkZpPk-.js";import{u as he}from"./useCompositeItem-D9m1dI9T.js";import{c as Y,n as G}from"./createBaseUIEventDetails-ByMWqkvP.js";import{a as Te}from"./useButton-BjJFDiZL.js";import{a as xe,c as Ce}from"./element-DmyaY4bW.js";import"./isElementDisabled-CwHw_lZC.js";import"./composite-DOn_YXxX.js";import"./composite-DI-9wL89.js";import"./floating-ui.utils-D9tMzej3.js";import"./event-BOP_-AC1.js";import"./detectBrowser-5lYXwz_k.js";import"./constants-CRqqCNE_.js";import"./useId-B8m7M0JZ.js";const re=n.createContext(void 0);function V(){const t=n.useContext(re);if(t===void 0)throw new Error(se(64));return t}let Re=(function(t){return t.activationDirection="data-activation-direction",t.orientation="data-orientation",t})({});const W={tabActivationDirection:t=>({[Re.activationDirection]:t})},Me=n.forwardRef(function(s,c){const{className:f,defaultValue:e=0,onValueChange:a,orientation:o="horizontal",render:p,value:v,...g}=s,h=me(),x=n.useRef([]),[R,M]=n.useState(()=>new Map),[l,y]=de({controlled:v,default:e,name:"Tabs",state:"value"}),[b,A]=n.useState(()=>new Map),[u,P]=n.useState("none"),I=U((i,r)=>{a==null||a(i,r),!r.isCanceled&&(y(i),P(r.activationDirection))}),w=U((i,r)=>{M(m=>{if(m.get(i)===r)return m;const E=new Map(m);return E.set(i,r),E})}),T=U((i,r)=>{M(m=>{if(!m.has(i)||m.get(i)!==r)return m;const E=new Map(m);return E.delete(i),E})}),d=n.useCallback(i=>R.get(i),[R]),D=n.useCallback(i=>{for(const r of b.values())if(i===(r==null?void 0:r.value))return r==null?void 0:r.id},[b]),S=n.useCallback(i=>{if(i===void 0)return null;for(const[r,m]of b.entries())if(m!=null&&i===(m.value??m.index))return r;return null},[b]),z=n.useMemo(()=>({direction:h,getTabElementBySelectedValue:S,getTabIdByPanelValue:D,getTabPanelIdByValue:d,onValueChange:I,orientation:o,registerMountedTabPanel:w,setTabMap:A,unregisterMountedTabPanel:T,tabActivationDirection:u,value:l}),[h,S,D,d,I,o,w,A,T,u,l]),B=F("div",s,{state:{orientation:o,tabActivationDirection:u},ref:c,props:g,stateAttributesMapping:W});return _.jsx(re.Provider,{value:z,children:_.jsx(ve,{elementsRef:x,children:B})})}),ce=n.createContext(void 0);function ye(){const t=n.useContext(ce);if(t===void 0)throw new Error(se(65));return t}const Ae=n.forwardRef(function(s,c){const{className:f,disabled:e=!1,render:a,value:o,id:p,nativeButton:v=!0,...g}=s,{value:h,getTabPanelIdByValue:x,orientation:R}=V(),{activateOnFocus:M,highlightedTabIndex:l,onTabActivation:y,setHighlightedTabIndex:b,tabsListElement:A}=ye(),u=ie(p),P=n.useMemo(()=>({disabled:e,id:u,value:o}),[e,u,o]),{compositeProps:I,compositeRef:w,index:T}=he({metadata:P}),d=o===h,D=n.useRef(!1);H(()=>{if(D.current){D.current=!1;return}if(!(d&&T>-1&&l!==T))return;const C=A;if(C!=null){const N=xe(K(C));if(N&&Ce(C,N))return}b(T)},[d,T,l,b,e,A]);const{getButtonProps:S,buttonRef:z}=Te({disabled:e,native:v,focusableWhenDisabled:!0}),q=x(o),B=n.useRef(!1),i=n.useRef(!1);function r(C){d||e||y(o,Y(G,C.nativeEvent,void 0,{activationDirection:"none"}))}function m(C){d||(T>-1&&b(T),!e&&M&&(!B.current||B.current&&i.current)&&y(o,Y(G,C.nativeEvent,void 0,{activationDirection:"none"})))}function E(C){if(d||e)return;B.current=!0;function N(){B.current=!1,i.current=!1}(!C.button||C.button===0)&&(i.current=!0,K(C.currentTarget).addEventListener("pointerup",N,{once:!0}))}const ue=n.useMemo(()=>({disabled:e,active:d,orientation:R}),[e,d,R]);return F("button",s,{state:ue,ref:[c,z,w],props:[I,{role:"tab","aria-controls":q,"aria-selected":d,id:u,onClick:r,onFocus:m,onPointerDown:E,[pe]:d?"":void 0,onKeyDownCapture(){D.current=!0}},g,S]})});let De=(function(t){return t.index="data-index",t.activationDirection="data-activation-direction",t.orientation="data-orientation",t.hidden="data-hidden",t})({});const Pe=n.forwardRef(function(s,c){const{className:f,value:e,render:a,keepMounted:o=!1,...p}=s,{value:v,getTabIdByPanelValue:g,orientation:h,tabActivationDirection:x,registerMountedTabPanel:R,unregisterMountedTabPanel:M}=V(),l=ie(),y=n.useMemo(()=>({id:l,value:e}),[l,e]),{ref:b,index:A}=be({metadata:y}),u=e!==v,P=g(e),I=n.useMemo(()=>({hidden:u,orientation:h,tabActivationDirection:x}),[u,h,x]),w=F("div",s,{state:I,ref:[c,b],props:[{"aria-labelledby":P,hidden:u,id:l??void 0,role:"tabpanel",tabIndex:u?-1:0,[De.index]:A},p],stateAttributesMapping:W});return H(()=>{if(!(u&&!o)&&l!=null)return R(e,l),()=>{M(e,l)}},[u,o,e,l,R,M]),!u||o?w:null}),Ie=n.forwardRef(function(s,c){const{activateOnFocus:f=!1,className:e,loopFocus:a=!0,render:o,...p}=s,{getTabElementBySelectedValue:v,onValueChange:g,orientation:h,value:x,setTabMap:R,tabActivationDirection:M}=V(),[l,y]=n.useState(0),[b,A]=n.useState(null),u=we(x,h,b,v),P=U((d,D)=>{if(d!==x){const S=u(d);D.activationDirection=S,g(d,D)}}),I=n.useMemo(()=>({orientation:h,tabActivationDirection:M}),[h,M]),w={"aria-orientation":h==="vertical"?"vertical":void 0,role:"tablist"},T=n.useMemo(()=>({activateOnFocus:f,highlightedTabIndex:l,onTabActivation:P,setHighlightedTabIndex:y,tabsListElement:b,value:x}),[f,l,P,y,b,x]);return _.jsx(ce.Provider,{value:T,children:_.jsx(ge,{render:o,className:e,state:I,refs:[c,A],props:[w,p],stateAttributesMapping:W,highlightedIndex:l,enableHomeAndEndKeys:!0,loopFocus:a,orientation:h,onHighlightedIndexChange:y,onMapChange:R,disabledIndices:fe})})});function J(t,s){const{left:c,top:f}=t.getBoundingClientRect(),{left:e,top:a}=s.getBoundingClientRect(),o=c-e,p=f-a;return{left:o,top:p}}function we(t,s,c,f){const[e,a]=n.useState(null);return H(()=>{if(t==null||c==null){a(null);return}const o=f(t);if(o==null){a(null);return}const{left:p,top:v}=J(o,c);a(s==="horizontal"?p:v)},[s,f,c,t]),n.useCallback(o=>{if(o===t)return"none";if(o==null)return a(null),"none";if(o!=null&&c!=null){const p=f(o);if(p!=null){const{left:v,top:g}=J(p,c);if(e==null)return a(s==="horizontal"?v:g),"none";if(s==="horizontal"){if(v<e)return a(v),"left";if(v>e)return a(v),"right"}else{if(g<e)return a(g),"up";if(g>e)return a(g),"down"}}}return"none"},[f,s,e,c,t])}const _e="_root_1tpc6_1",Ee="_list_1tpc6_5",Se="_tab_1tpc6_11",Be="_selected_1tpc6_37",je="_panel_1tpc6_47",j={root:_e,list:Ee,tab:Se,selected:Be,panel:je};function le({items:t,defaultValue:s}){var f;const c=s||((f=t[0])==null?void 0:f.value);return _.jsxs(Me,{className:j.root,defaultValue:c,children:[_.jsx(Ie,{className:j.list,children:t.map(e=>_.jsx(Ae,{value:e.value,disabled:e.disabled,className:a=>[j.tab,a.active?j.selected:""].filter(Boolean).join(" "),children:e.label},e.value))}),t.map(e=>_.jsx(Pe,{value:e.value,className:j.panel,children:e.content},e.value))]})}le.__docgenInfo={description:"",methods:[],displayName:"Tabs",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"TabItem"}],raw:"TabItem[]"},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:""}}};const it={title:"Synapse/Tabs",component:le},L={args:{items:[{value:"overview",label:"Overview",content:"Overview panel content. This shows the high-level summary of the selected item."},{value:"details",label:"Details",content:"Details panel content with more granular information about configuration and settings."},{value:"activity",label:"Activity",content:"Recent activity log showing the latest events and changes."}]}},O={args:{items:[{value:"active",label:"Active",content:"This tab is active."},{value:"pending",label:"Pending",content:"This tab is pending."},{value:"archived",label:"Archived",content:"Archived content.",disabled:!0}]}},k={args:{items:[{value:"1",label:"Dashboard",content:"Dashboard content"},{value:"2",label:"Analytics",content:"Analytics content"},{value:"3",label:"Reports",content:"Reports content"},{value:"4",label:"Settings",content:"Settings content"},{value:"5",label:"Users",content:"Users content"}]}};var Q,X,Z;L.parameters={...L.parameters,docs:{...(Q=L.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    items: [{
      value: "overview",
      label: "Overview",
      content: "Overview panel content. This shows the high-level summary of the selected item."
    }, {
      value: "details",
      label: "Details",
      content: "Details panel content with more granular information about configuration and settings."
    }, {
      value: "activity",
      label: "Activity",
      content: "Recent activity log showing the latest events and changes."
    }]
  }
}`,...(Z=(X=L.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var $,ee,te;O.parameters={...O.parameters,docs:{...($=O.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    items: [{
      value: "active",
      label: "Active",
      content: "This tab is active."
    }, {
      value: "pending",
      label: "Pending",
      content: "This tab is pending."
    }, {
      value: "archived",
      label: "Archived",
      content: "Archived content.",
      disabled: true
    }]
  }
}`,...(te=(ee=O.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ne,oe,ae;k.parameters={...k.parameters,docs:{...(ne=k.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    items: [{
      value: "1",
      label: "Dashboard",
      content: "Dashboard content"
    }, {
      value: "2",
      label: "Analytics",
      content: "Analytics content"
    }, {
      value: "3",
      label: "Reports",
      content: "Reports content"
    }, {
      value: "4",
      label: "Settings",
      content: "Settings content"
    }, {
      value: "5",
      label: "Users",
      content: "Users content"
    }]
  }
}`,...(ae=(oe=k.parameters)==null?void 0:oe.docs)==null?void 0:ae.source}}};const rt=["Default","WithDisabled","ManyTabs"];export{L as Default,k as ManyTabs,O as WithDisabled,rt as __namedExportsOrder,it as default};
