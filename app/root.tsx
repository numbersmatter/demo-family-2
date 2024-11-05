import { MetaFunction } from "@remix-run/react";
import { isRouteErrorResponse, json, useLoaderData, useRouteError } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, SignedIn, SignedOut, UserButton } from "@clerk/remix";

import "./tailwind.css";
import { getClientEnv, getServerEnv } from "./lib/env-variables.server";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { FamilySidebar } from "./components/standardized/family-app-sidebar";
import { Separator } from "./components/ui/separator";




export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


export const loader = async (args: LoaderFunctionArgs) => {


  return rootAuthLoader(args, ({ request }) => {
    const clientEnv = getClientEnv();

    return ({ clientEnv });
  })

};


export const meta: MetaFunction<typeof loader> = ({ data }) => [

  { title: data?.clientEnv.title },
];



export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function PageHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h3>
        Food Pantry App
      </h3>
      <Separator orientation="vertical" className="mr-2 h-4" />
      <UserButton />
    </header>
  )


}

function App() {
  return <>
    <SignedIn>
      <SidebarProvider>
        <FamilySidebar />
        <SidebarInset>
          <PageHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </SignedIn>
    <SignedOut>
      <Outlet />
    </SignedOut>
  </>
}

export default ClerkApp(App);


export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
              ? error.message
              : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}