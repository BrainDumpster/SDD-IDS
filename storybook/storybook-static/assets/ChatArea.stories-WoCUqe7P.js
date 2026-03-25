import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-JhL3uwfD.js";const y="_root_m2syb_1",g="_messages_m2syb_11",f="_bubble_m2syb_18",_="_user_m2syb_25",b="_system_m2syb_31",w="_content_m2syb_37",x="_timestamp_m2syb_43",t={root:y,messages:g,bubble:f,user:_,system:b,content:w,timestamp:x};function h({messages:n}){const r=i.useRef(null);return i.useEffect(()=>{var s;(s=r.current)==null||s.scrollIntoView({behavior:"smooth"})},[n]),e.jsx("div",{className:t.root,role:"log","aria-label":"Chat messages",children:e.jsxs("div",{className:t.messages,children:[n.map(s=>e.jsxs("div",{className:[t.bubble,s.sender==="user"?t.user:t.system].join(" "),children:[e.jsx("p",{className:t.content,children:s.content}),s.timestamp&&e.jsx("time",{className:t.timestamp,children:s.timestamp})]},s.id)),e.jsx("div",{ref:r})]})})}h.__docgenInfo={description:"",methods:[],displayName:"ChatArea",props:{messages:{required:!0,tsType:{name:"Array",elements:[{name:"ChatMessage"}],raw:"ChatMessage[]"},description:""}}};const j={title:"Synapse/ChatArea",component:h},o={args:{messages:[{id:"1",content:"Hello, I need help with my account settings.",sender:"user",timestamp:"10:00 AM"},{id:"2",content:"Of course! I can help you with that. What would you like to change?",sender:"system",timestamp:"10:01 AM"},{id:"3",content:"I want to update my notification preferences.",sender:"user",timestamp:"10:02 AM"},{id:"4",content:"You can find notification preferences under Settings > Notifications. Would you like me to walk you through the options?",sender:"system",timestamp:"10:02 AM"},{id:"5",content:"Yes please, that would be helpful.",sender:"user",timestamp:"10:03 AM"}]},decorators:[n=>e.jsx("div",{style:{height:400},children:e.jsx(n,{})})]},a={args:{messages:[{id:"1",content:"Welcome! How can I assist you today?",sender:"system"}]},decorators:[n=>e.jsx("div",{style:{height:300},children:e.jsx(n,{})})]};var c,m,d;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    messages: [{
      id: "1",
      content: "Hello, I need help with my account settings.",
      sender: "user",
      timestamp: "10:00 AM"
    }, {
      id: "2",
      content: "Of course! I can help you with that. What would you like to change?",
      sender: "system",
      timestamp: "10:01 AM"
    }, {
      id: "3",
      content: "I want to update my notification preferences.",
      sender: "user",
      timestamp: "10:02 AM"
    }, {
      id: "4",
      content: "You can find notification preferences under Settings > Notifications. Would you like me to walk you through the options?",
      sender: "system",
      timestamp: "10:02 AM"
    }, {
      id: "5",
      content: "Yes please, that would be helpful.",
      sender: "user",
      timestamp: "10:03 AM"
    }]
  },
  decorators: [Story => <div style={{
    height: 400
  }}>
        <Story />
      </div>]
}`,...(d=(m=o.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var l,u,p;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    messages: [{
      id: "1",
      content: "Welcome! How can I assist you today?",
      sender: "system"
    }]
  },
  decorators: [Story => <div style={{
    height: 300
  }}>
        <Story />
      </div>]
}`,...(p=(u=a.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const v=["Conversation","SingleMessage"];export{o as Conversation,a as SingleMessage,v as __namedExportsOrder,j as default};
