import{j as a}from"./jsx-runtime-D_zvdyIk.js";const h="_root_810ul_1",P="_bar_810ul_8",S="_segment_810ul_16",x="_complete_810ul_22",j="_active_810ul_26",T="_pending_810ul_30",A="_labels_810ul_34",D="_label_810ul_34",N="_label_complete_810ul_49",k="_label_active_810ul_53",y="_label_pending_810ul_58",s={root:h,bar:P,segment:S,complete:x,active:j,pending:T,labels:A,label:D,label_complete:N,label_active:k,label_pending:y};function v({items:o}){return a.jsxs("div",{className:s.root,children:[a.jsx("div",{className:s.bar,role:"list",children:o.map((e,r)=>a.jsx("div",{className:[s.segment,s[e.status]].join(" "),role:"listitem","aria-label":`${e.label}: ${e.status}`,title:`${e.label}: ${e.status}`},r))}),a.jsx("div",{className:s.labels,children:o.map((e,r)=>a.jsx("span",{className:[s.label,s[`label_${e.status}`]].join(" "),children:e.label},r))})]})}v.__docgenInfo={description:"",methods:[],displayName:"Tracker",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"TrackerItem"}],raw:"TrackerItem[]"},description:""}}};const f={title:"Synapse/Tracker",component:v},t={args:{items:[{label:"Planning",status:"complete"},{label:"Design",status:"complete"},{label:"Development",status:"active"},{label:"Testing",status:"pending"},{label:"Release",status:"pending"}]}},l={args:{items:[{label:"Step 1",status:"complete"},{label:"Step 2",status:"complete"},{label:"Step 3",status:"complete"}]}},n={args:{items:[{label:"Phase A",status:"pending"},{label:"Phase B",status:"pending"},{label:"Phase C",status:"pending"},{label:"Phase D",status:"pending"}]}};var c,p,i;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Planning",
      status: "complete"
    }, {
      label: "Design",
      status: "complete"
    }, {
      label: "Development",
      status: "active"
    }, {
      label: "Testing",
      status: "pending"
    }, {
      label: "Release",
      status: "pending"
    }]
  }
}`,...(i=(p=t.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};var m,u,b;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Step 1",
      status: "complete"
    }, {
      label: "Step 2",
      status: "complete"
    }, {
      label: "Step 3",
      status: "complete"
    }]
  }
}`,...(b=(u=l.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var d,_,g;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Phase A",
      status: "pending"
    }, {
      label: "Phase B",
      status: "pending"
    }, {
      label: "Phase C",
      status: "pending"
    }, {
      label: "Phase D",
      status: "pending"
    }]
  }
}`,...(g=(_=n.parameters)==null?void 0:_.docs)==null?void 0:g.source}}};const C=["MixedStatus","AllComplete","AllPending"];export{l as AllComplete,n as AllPending,t as MixedStatus,C as __namedExportsOrder,f as default};
