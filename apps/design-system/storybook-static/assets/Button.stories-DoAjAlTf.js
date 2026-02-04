import{r as $}from"./index-GiUgBvb1.js";import{j as a}from"./jsx-runtime-CDt2p4po.js";var q={primary:"bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",secondary:"bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500",ghost:"bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500"},V={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},p=$.forwardRef(({variant:e="primary",size:r="md",className:c="",children:l,...u},d)=>a.jsx("button",{ref:d,className:`inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${q[e]} ${V[r]} ${c}`,...u,children:l}));p.displayName="Button";var L=$.forwardRef(({label:e,error:r,className:c="",id:l,...u},d)=>{const m=l||(e==null?void 0:e.toLowerCase().replace(/\s+/g,"-"));return a.jsxs("div",{className:"flex flex-col gap-1",children:[e&&a.jsx("label",{htmlFor:m,className:"text-sm font-medium text-neutral-700",children:e}),a.jsx("input",{ref:d,id:m,className:`
            w-full px-3 py-2 rounded-md border transition-colors
            ${r?"border-error-500 focus:ring-error-500":"border-neutral-300 focus:ring-primary-500"}
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${c}
          `,...u}),r&&a.jsx("span",{className:"text-sm text-error-500",children:r})]})});L.displayName="Input";p.__docgenInfo={description:"",methods:[],displayName:"Button",props:{variant:{defaultValue:{value:'"primary"',computed:!1},required:!1},size:{defaultValue:{value:'"md"',computed:!1},required:!1},className:{defaultValue:{value:'""',computed:!1},required:!1}}};L.__docgenInfo={description:"",methods:[],displayName:"Input",props:{className:{defaultValue:{value:'""',computed:!1},required:!1}}};const C={title:"Components/Button",component:p,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","ghost"]},size:{control:"select",options:["sm","md","lg"]}}},s={args:{children:"Button",variant:"primary"}},t={args:{children:"Button",variant:"secondary"}},o={args:{children:"Button",variant:"ghost"}},n={args:{children:"Small Button",size:"sm"}},i={args:{children:"Large Button",size:"lg"}};var g,f,y;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    variant: 'primary'
  }
}`,...(y=(f=s.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var x,h,v;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    variant: 'secondary'
  }
}`,...(v=(h=t.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var S,B,b;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    variant: 'ghost'
  }
}`,...(b=(B=o.parameters)==null?void 0:B.docs)==null?void 0:b.source}}};var N,j,z;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    children: 'Small Button',
    size: 'sm'
  }
}`,...(z=(j=n.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var w,I,_;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: 'Large Button',
    size: 'lg'
  }
}`,...(_=(I=i.parameters)==null?void 0:I.docs)==null?void 0:_.source}}};const G=["Primary","Secondary","Ghost","Small","Large"];export{o as Ghost,i as Large,s as Primary,t as Secondary,n as Small,G as __namedExportsOrder,C as default};
