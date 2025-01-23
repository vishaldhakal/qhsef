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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-6 sm:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <Breadcrumb className="mb-8">
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
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
                Quality Assessment Report
              </CardTitle>
              <div className="flex flex-col xs:flex-row w-full sm:w-auto items-start xs:items-center gap-3">
                <Badge
                  variant={report.percentage >= 60 ? "default" : "destructive"}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  {report.category.toUpperCase()} Category
                </Badge>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full xs:w-auto bg-white/20 text-white hover:bg-white/30 border-white/30"
                >
                  <Link href={report.file_url} target="_blank">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-4 order-2 md:order-1">
                <div className="bg-blue-50 p-4 sm:p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 sm:mb-4">
                    Personal Details
                  </h3>
                  <div className="space-y-3">
                    <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <strong className="text-gray-700 sm:min-w-[80px]">
                        Name:
                      </strong>
                      <span className="text-gray-600 break-all">
                        {report.name}
                      </span>
                    </p>
                    <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <strong className="text-gray-700 sm:min-w-[80px]">
                        Email:
                      </strong>
                      <span className="text-gray-600 break-all">
                        {report.email}
                      </span>
                    </p>
                    <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <strong className="text-gray-700 sm:min-w-[80px]">
                        Phone:
                      </strong>
                      <span className="text-gray-600">{report.phone}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-end items-center order-1 md:order-2">
                <div className="w-full md:w-auto">
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6 lg:p-8 rounded-xl border border-blue-100">
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                        {report.earned_points.toFixed(1)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Earned Points
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-600">
                        {report.percentage}%
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Completion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-100 pt-6 sm:pt-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-6">
                Detailed Assessment
              </h3>
              <Accordion type="multiple" className="space-y-4">
                {report.requirements.map((requirement, index) => (
                  <AccordionItem
                    key={index}
                    value={`requirement-${index}`}
                    className="border border-blue-100 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="bg-blue-50 px-4 sm:px-6 py-4 hover:bg-blue-100 transition-colors">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-4 w-full">
                        <span className="font-semibold text-blue-800 text-left">
                          {requirement.requirement_name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="xs:ml-auto bg-white border-blue-200 whitespace-nowrap"
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
                      <div className="space-y-3 p-4 sm:p-6">
                        {requirement.answers.map((answer, answerIndex) => (
                          <div
                            key={answerIndex}
                            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg gap-3 ${
                              answer.answer === "Yes"
                                ? "bg-green-50 border border-green-100"
                                : "bg-red-50 border border-red-100"
                            }`}
                          >
                            <div className="flex items-start sm:items-center gap-3 flex-1">
                              {answer.answer === "Yes" ? (
                                <CheckCircle className="text-green-500 h-5 w-5 shrink-0 mt-1 sm:mt-0" />
                              ) : (
                                <XCircle className="text-red-500 h-5 w-5 shrink-0 mt-1 sm:mt-0" />
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
                              className="text-xs whitespace-nowrap"
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
