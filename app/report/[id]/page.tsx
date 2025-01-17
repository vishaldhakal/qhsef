import { Report } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Download, Award, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 60;
export const dynamicParams = true;

async function fetchReportData(id: string): Promise<Report> {
  const response = await fetch(
    `https://cim.baliyoventures.com/api/koshi_quality_standard/report/${id}/`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch report data");
  }

  return response.json();
}

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const report = await fetchReportData(params.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-gray-600 hover:text-blue-600"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-blue-600">
                Report #{report.id}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="shadow-xl border-none">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Quality Assessment Report
              </CardTitle>
              <div className="flex items-center gap-4">
                <Badge
                  variant={report.percentage >= 60 ? "default" : "destructive"}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  {report.category.toUpperCase()} Category
                </Badge>
                <Button
                  asChild
                  variant="outline"
                  className="bg-white/20 text-white hover:bg-white/30 border-white/30"
                >
                  <Link href={report.file_url} target="_blank">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Personal Details
                  </h3>
                  <p>
                    <strong>Name:</strong> {report.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {report.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {report.phone}
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <div className="flex items-center gap-8 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {report.earned_points.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">Earned Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-cyan-600">
                      {report.percentage}%
                    </p>
                    <p className="text-sm text-gray-600">Completion</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-100 pt-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Detailed Assessment
              </h3>
              <Accordion type="multiple" className="space-y-4">
                {report.requirements.map((requirement, index) => (
                  <AccordionItem
                    key={index}
                    value={`requirement-${index}`}
                    className="border-blue-100 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="bg-blue-50 px-4 hover:bg-blue-100 transition-colors">
                      <div className="flex items-center gap-4 w-full">
                        <span className="font-semibold text-blue-800">
                          {requirement.requirement_name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="ml-auto bg-white border-blue-200"
                        >
                          {
                            requirement.answers.filter(
                              (a) => a.answer === "Yes"
                            ).length
                          }{" "}
                          / {requirement.answers.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      <div className="space-y-2 p-4">
                        {requirement.answers.map((answer, answerIndex) => (
                          <div
                            key={answerIndex}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              answer.answer === "Yes"
                                ? "bg-green-50 border-green-100"
                                : "bg-red-50 border-red-100"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {answer.answer === "Yes" ? (
                                <CheckCircle className="text-green-500 h-5 w-5" />
                              ) : (
                                <XCircle className="text-red-500 h-5 w-5" />
                              )}
                              <span className="text-gray-700">
                                {answer.question}
                              </span>
                            </div>
                            <Badge
                              variant={
                                answer.answer === "Yes"
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {answer.points} pts
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // If you want to prerender some known report IDs
  return [{ id: "72" }];
}
