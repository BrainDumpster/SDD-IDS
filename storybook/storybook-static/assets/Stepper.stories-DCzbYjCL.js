import{j as t}from"./jsx-runtime-D_zvdyIk.js";const j="_root_xs91v_1",w="_step_xs91v_7",P="_connector_xs91v_16",b="_connectorActive_xs91v_29",y="_circle_xs91v_33",C="_number_xs91v_51",N="_label_xs91v_55",R="_active_xs91v_64",k="_completed_xs91v_76",e={root:j,step:w,connector:P,connectorActive:b,circle:y,number:C,label:N,active:R,completed:k};function x({steps:A,activeStep:S,completed:h=[]}){return t.jsx("div",{className:e.root,role:"list",children:A.map((g,r)=>{const n=r===S,a=h.includes(r);return t.jsxs("div",{className:[e.step,n?e.active:"",a?e.completed:""].filter(Boolean).join(" "),role:"listitem","aria-current":n?"step":void 0,children:[r>0&&t.jsx("div",{className:[e.connector,a||n?e.connectorActive:""].filter(Boolean).join(" ")}),t.jsx("div",{className:e.circle,children:a?t.jsx(T,{}):t.jsx("span",{className:e.number,children:r+1})}),t.jsx("span",{className:e.label,children:g})]},r)})})}function T(){return t.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:t.jsx("path",{d:"M2.5 7L5.5 10L11.5 4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}x.__docgenInfo={description:"",methods:[],displayName:"Stepper",props:{steps:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},activeStep:{required:!0,tsType:{name:"number"},description:""},completed:{required:!1,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};const q={title:"Synapse/Stepper",component:x},s={args:{steps:["Account","Profile","Preferences","Review"],activeStep:1}},c={args:{steps:["Account","Profile","Preferences","Review"],activeStep:2,completed:[0,1]}},o={args:{steps:["Account","Profile","Preferences","Review"],activeStep:3,completed:[0,1,2,3]}};var i,p,l;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 1
  }
}`,...(l=(p=s.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var m,d,u;c.parameters={...c.parameters,docs:{...(m=c.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 2,
    completed: [0, 1]
  }
}`,...(u=(d=c.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var v,_,f;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    steps: ["Account", "Profile", "Preferences", "Review"],
    activeStep: 3,
    completed: [0, 1, 2, 3]
  }
}`,...(f=(_=o.parameters)==null?void 0:_.docs)==null?void 0:f.source}}};const B=["AtStepTwo","WithCompleted","AllCompleted"];export{o as AllCompleted,s as AtStepTwo,c as WithCompleted,B as __namedExportsOrder,q as default};
