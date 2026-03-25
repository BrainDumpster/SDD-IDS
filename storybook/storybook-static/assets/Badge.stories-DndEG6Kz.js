import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{B as w}from"./Button-BI0SS6yn.js";import"./index-JhL3uwfD.js";import"./useButton-BjJFDiZL.js";import"./floating-ui.utils.dom-Bqtipqz1.js";import"./useRenderElement-RsBRv27X.js";import"./useIsoLayoutEffect-CnFbsThY.js";const O="_wrapper_1y94r_1",L="_badge_1y94r_6",M="_count_1y94r_21",T="_dot_1y94r_31",t={wrapper:O,badge:L,count:M,dot:T};function e({count:r,dot:u,children:R}){const N=u||r!=null&&r>0,S=r!=null&&r>99?"99+":r;return n.jsxs("span",{className:t.wrapper,children:[R,N&&n.jsx("span",{className:`${t.badge} ${u?t.dot:t.count}`,children:!u&&S})]})}e.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{count:{required:!1,tsType:{name:"number"},description:""},dot:{required:!1,tsType:{name:"boolean"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const $={title:"Synapse/Badge",component:e,argTypes:{count:{control:"number"},dot:{control:"boolean"}}},o={args:{count:5,children:n.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:4,background:"var(--color-background-surface-1)"},children:n.jsx(l,{})})}},s={args:{dot:!0,children:n.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:4,background:"var(--color-background-surface-1)"},children:n.jsx(l,{})})}},a={args:{count:150,children:n.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:4,background:"var(--color-background-surface-1)"},children:n.jsx(l,{})})}},c={render:()=>n.jsx(e,{count:3,children:n.jsx(w,{variant:"secondary",children:"Notifications"})})},i={render:()=>n.jsxs("div",{style:{display:"flex",gap:32,alignItems:"center"},children:[n.jsx(e,{count:4,children:n.jsx(d,{})}),n.jsx(e,{count:99,children:n.jsx(d,{})}),n.jsx(e,{count:150,children:n.jsx(d,{})}),n.jsx(e,{dot:!0,children:n.jsx(d,{})}),n.jsx(e,{count:2,children:n.jsx(w,{variant:"primary",children:"Messages"})})]})};function d(){return n.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:4,background:"var(--color-background-surface-1)"},children:n.jsx(l,{})})}function l(){return n.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[n.jsx("path",{d:"M12 5.33C12 4.27 11.58 3.25 10.83 2.5C10.08 1.75 9.06 1.33 8 1.33C6.94 1.33 5.92 1.75 5.17 2.5C4.42 3.25 4 4.27 4 5.33C4 10 2 11.33 2 11.33H14C14 11.33 12 10 12 5.33Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M9.15 13.33C9.03 13.55 8.86 13.73 8.65 13.86C8.44 13.99 8.2 14.05 7.96 14.05C7.72 14.05 7.48 13.99 7.27 13.86C7.06 13.73 6.89 13.55 6.77 13.33",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]})}var p,g,h;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    count: 5,
    children: <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      borderRadius: 4,
      background: "var(--color-background-surface-1)"
    }}>
        <BellIcon />
      </span>
  }
}`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var m,x,y;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    dot: true,
    children: <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      borderRadius: 4,
      background: "var(--color-background-surface-1)"
    }}>
        <BellIcon />
      </span>
  }
}`,...(y=(x=s.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var j,f,B;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    count: 150,
    children: <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      borderRadius: 4,
      background: "var(--color-background-surface-1)"
    }}>
        <BellIcon />
      </span>
  }
}`,...(B=(f=a.parameters)==null?void 0:f.docs)==null?void 0:B.source}}};var b,C,k;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <Badge count={3}>
      <Button variant="secondary">Notifications</Button>
    </Badge>
}`,...(k=(C=c.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var I,v,_;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 32,
    alignItems: "center"
  }}>
      <Badge count={4}>
        <IconBox />
      </Badge>
      <Badge count={99}>
        <IconBox />
      </Badge>
      <Badge count={150}>
        <IconBox />
      </Badge>
      <Badge dot>
        <IconBox />
      </Badge>
      <Badge count={2}>
        <Button variant="primary">Messages</Button>
      </Badge>
    </div>
}`,...(_=(v=i.parameters)==null?void 0:v.docs)==null?void 0:_.source}}};const Z=["WithCount","DotOnly","HighCount","OnButton","AllVariants"];export{i as AllVariants,s as DotOnly,a as HighCount,c as OnButton,o as WithCount,Z as __namedExportsOrder,$ as default};
