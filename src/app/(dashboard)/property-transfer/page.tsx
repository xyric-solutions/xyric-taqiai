import Link from "next/link";
import Card from "@/components/ui/Card";
import { Building, Calculator } from "lucide-react";

export default function PropertyTransferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Property Transfer / جائیداد کی منتقلی</h1>
        <p className="text-gray-500 mt-1">Property transfer documents and tax calculations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/agreements/sale-deed">
          <Card hover className="p-5 h-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Property Transfer Agreement</h3>
                <p className="text-sm text-gray-500 mt-1">Sale deed and property transfer documents</p>
                <p className="text-xs text-gray-400 mt-2" dir="rtl">بیع نامہ اور جائیداد کی منتقلی کی دستاویزات</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/property-transfer/tax-calculator">
          <Card hover className="p-5 h-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tax Calculator</h3>
                <p className="text-sm text-gray-500 mt-1">Calculate stamp duty, FBR, PLRA, withholding & gain tax</p>
                <p className="text-xs text-gray-400 mt-2" dir="rtl">سٹیمپ ڈیوٹی، ایف بی آر، ود ہولڈنگ ٹیکس کا حساب</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
