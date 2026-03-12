export { default } from "./index";
```

That re-exports the sign-up page so any sub-route of `/sign-up` shows the same SignUp component, which Clerk then handles internally.
