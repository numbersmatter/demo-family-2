import { useLoaderData, Link } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { loader } from "../route";
import { Button } from "~/components/ui/button";
import { AddressSchema } from "../data/schemas";




export default function AddressCheckCard() {
  const { language, address, redirectLinks } = useLoaderData<typeof loader>();

  const english = {
    title: "Address",
    description: "Review Address",
    button: "Go to Address",
    successTitle: "Address is valid",
    failureTitle: "Error with address",
  }


  const spanish = {
    title: "Dirección",
    description: "Revise la Dirección",
    successTitle: "La dirección es valida",
    failureTitle: "Error con la dirección",
    button: "Ir a Dirección",
  }

  const checkAddress = AddressSchema.safeParse(address);
  const success = checkAddress.success;

  const addressErrors = checkAddress.error;


  const lang = language === "es" ? spanish : english;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {lang.title}
        </CardTitle>
        <CardDescription>
          {lang.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {
          success ?
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold">
                  {lang.successTitle}
                </div>
                <div className="text-lg">
                  {address.street}
                </div>
                <div className="text-lg">
                  {address.unit}
                </div>
                <div className="text-lg">
                  {address.city}, {address.state} {address.zip}
                </div>
              </div>
            </div>
            :
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold">
                  {lang.failureTitle}
                </div>
                <div className="text-lg">
                  <Link to={redirectLinks.address} className="underline">
                    <Button>
                      {lang.button}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
        }
        <pre>
          {JSON.stringify(addressErrors, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
