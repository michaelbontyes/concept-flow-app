import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FormGeneratorCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Form Generator</CardTitle>
        <CardDescription>
          Generate OpenMRS 3.0 forms from Excel metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Upload Excel files with form metadata and generate standardized OpenMRS 3.0 form schemas.
        </p>
        <Link href="/form-generator">
          <Button className="w-full">
            Open Form Generator <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}