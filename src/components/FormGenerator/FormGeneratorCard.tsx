import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FormGeneratorCard() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Form Generator</CardTitle>
        <CardDescription className="text-sm">
          Generate OpenMRS 3.0 forms
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Link href="/form-generator">
          <Button className="w-full text-sm" size="sm">
            Open <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
