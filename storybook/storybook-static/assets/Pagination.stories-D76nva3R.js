import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as D}from"./index-JhL3uwfD.js";const R="_pagination_1tniq_1",W="_pages_1tniq_8",A="_button_1tniq_14",O="_prevNext_1tniq_44",$="_pageButton_1tniq_49",C="_current_1tniq_55",G="_ellipsis_1tniq_66",n={pagination:R,pages:W,button:A,prevNext:O,pageButton:$,current:C,ellipsis:G};function P({currentPage:t,totalPages:s,onPageChange:r,className:m,...x}){const a=H(t,s);return e.jsxs("nav",{"aria-label":"Pagination",className:[n.pagination,m].filter(Boolean).join(" "),...x,children:[e.jsxs("button",{className:[n.button,n.prevNext].join(" "),disabled:t<=1,onClick:()=>r==null?void 0:r(t-1),"aria-label":"Previous page",children:[e.jsx(J,{}),e.jsx("span",{children:"Prev"})]}),e.jsx("div",{className:n.pages,children:a.map((o,z)=>{if(o==="ellipsis")return e.jsx("span",{className:n.ellipsis,children:"..."},`ellipsis-${z}`);const i=o,_=i===t;return e.jsx("button",{className:[n.button,n.pageButton,_?n.current:""].filter(Boolean).join(" "),"aria-current":_?"page":void 0,onClick:()=>r==null?void 0:r(i),children:i},i)})}),e.jsxs("button",{className:[n.button,n.prevNext].join(" "),disabled:t>=s,onClick:()=>r==null?void 0:r(t+1),"aria-label":"Next page",children:[e.jsx("span",{children:"Next"}),e.jsx(K,{})]})]})}function H(t,s){if(s<=7)return Array.from({length:s},(a,o)=>o+1);const r=[];r.push(1),t>3&&r.push("ellipsis");const m=Math.max(2,t-1),x=Math.min(s-1,t+1);for(let a=m;a<=x;a++)r.push(a);return t<s-2&&r.push("ellipsis"),r.push(s),r}function J(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M10 4L6 8L10 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}function K(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M6 4L10 8L6 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}P.__docgenInfo={description:"",methods:[],displayName:"Pagination",props:{currentPage:{required:!0,tsType:{name:"number"},description:""},totalPages:{required:!0,tsType:{name:"number"},description:""},onPageChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(page: number) => void",signature:{arguments:[{type:{name:"number"},name:"page"}],return:{name:"void"}}},description:""}},composes:["ComponentProps"]};const V={title:"Synapse/Pagination",component:P},c={args:{currentPage:3,totalPages:10}},p={args:{currentPage:15,totalPages:50}},u={args:{currentPage:1,totalPages:10}},l={args:{currentPage:10,totalPages:10}},g={args:{currentPage:2,totalPages:5}},d={render:()=>{const[t,s]=D.useState(1);return e.jsxs("div",{children:[e.jsx(P,{currentPage:t,totalPages:20,onPageChange:s}),e.jsxs("p",{style:{marginTop:16,color:"var(--color-text-neutral)",fontSize:14},children:["Current page: ",t]})]})}};var f,j,v;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    currentPage: 3,
    totalPages: 10
  }
}`,...(v=(j=c.parameters)==null?void 0:j.docs)==null?void 0:v.source}}};var h,b,N;p.parameters={...p.parameters,docs:{...(h=p.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    currentPage: 15,
    totalPages: 50
  }
}`,...(N=(b=p.parameters)==null?void 0:b.docs)==null?void 0:N.source}}};var y,k,L;u.parameters={...u.parameters,docs:{...(y=u.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    currentPage: 1,
    totalPages: 10
  }
}`,...(L=(k=u.parameters)==null?void 0:k.docs)==null?void 0:L.source}}};var S,q,B;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    currentPage: 10,
    totalPages: 10
  }
}`,...(B=(q=l.parameters)==null?void 0:q.docs)==null?void 0:B.source}}};var w,M,I;g.parameters={...g.parameters,docs:{...(w=g.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    currentPage: 2,
    totalPages: 5
  }
}`,...(I=(M=g.parameters)==null?void 0:M.docs)==null?void 0:I.source}}};var T,F,E;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    return <div>
        <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
        <p style={{
        marginTop: 16,
        color: "var(--color-text-neutral)",
        fontSize: 14
      }}>
          Current page: {page}
        </p>
      </div>;
  }
}`,...(E=(F=d.parameters)==null?void 0:F.docs)==null?void 0:E.source}}};const X=["Default","ManyPages","FirstPage","LastPage","FewPages","Interactive"];export{c as Default,g as FewPages,u as FirstPage,d as Interactive,l as LastPage,p as ManyPages,X as __namedExportsOrder,V as default};
