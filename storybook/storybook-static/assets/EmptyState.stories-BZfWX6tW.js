import{j as e}from"./jsx-runtime-D_zvdyIk.js";const y="_root_1o2ry_1",g="_icon_1o2ry_13",x="_title_1o2ry_18",k="_description_1o2ry_27",f="_action_1o2ry_36",t={root:y,icon:g,title:x,description:k,action:f};function p({icon:s,title:h,description:m,action:i}){return e.jsxs("div",{className:t.root,children:[s&&e.jsx("div",{className:t.icon,children:s}),e.jsx("h3",{className:t.title,children:h}),e.jsx("p",{className:t.description,children:m}),i&&e.jsx("button",{type:"button",className:t.action,onClick:i.onClick,children:i.label})]})}p.__docgenInfo={description:"",methods:[],displayName:"EmptyState",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:""},title:{required:!0,tsType:{name:"string"},description:""},description:{required:!0,tsType:{name:"string"},description:""},action:{required:!1,tsType:{name:"signature",type:"object",raw:"{ label: string; onClick: () => void }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}},description:""}}};const N={title:"Synapse/EmptyState",component:p};function j(){return e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 48 48",fill:"none",children:[e.jsx("rect",{x:"8",y:"28",width:"8",height:"12",rx:"1",stroke:"currentColor",strokeWidth:"2"}),e.jsx("rect",{x:"20",y:"20",width:"8",height:"20",rx:"1",stroke:"currentColor",strokeWidth:"2"}),e.jsx("rect",{x:"32",y:"8",width:"8",height:"32",rx:"1",stroke:"currentColor",strokeWidth:"2"})]})}function _(){return e.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 48 48",fill:"none",children:[e.jsx("circle",{cx:"22",cy:"22",r:"10",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M30 30L38 38",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]})}const r={args:{icon:e.jsx(j,{}),title:"No data yet",description:"Once data starts coming in, it will appear here. Check back later or adjust your filters."}},o={args:{icon:e.jsx(_,{}),title:"No results found",description:"Try adjusting your search or filter criteria to find what you're looking for.",action:{label:"Clear Filters",onClick:()=>alert("Filters cleared")}}};var n,a,c;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    icon: <ChartIcon />,
    title: "No data yet",
    description: "Once data starts coming in, it will appear here. Check back later or adjust your filters."
  }
}`,...(c=(a=r.parameters)==null?void 0:a.docs)==null?void 0:c.source}}};var l,d,u;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    icon: <SearchIcon />,
    title: "No results found",
    description: "Try adjusting your search or filter criteria to find what you're looking for.",
    action: {
      label: "Clear Filters",
      onClick: () => alert("Filters cleared")
    }
  }
}`,...(u=(d=o.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};const w=["NoData","NoResults"];export{r as NoData,o as NoResults,w as __namedExportsOrder,N as default};
