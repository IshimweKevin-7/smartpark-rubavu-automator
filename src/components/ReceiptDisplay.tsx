
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Receipt, Download, Clock, DollarSign, Car, User } from 'lucide-react';

const ReceiptDisplay = ({ receipt }) => {
  if (!receipt) {
    return (
      <Card className="p-6 bg-gray-50 border-gray-200">
        <div className="text-center">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No receipt to display</p>
          <p className="text-sm text-gray-500 mt-2">
            Process a car exit to generate a receipt
          </p>
        </div>
      </Card>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-RW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (duration) => {
    return `${duration.hours}h ${duration.minutes}m`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>SmartPark Receipt - ${receipt.plateNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .content { margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center bg-blue-50">
        <CardTitle className="flex items-center justify-center gap-2">
          <Receipt className="h-5 w-5" />
          Parking Receipt
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6" id="receipt-content">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold">SmartPark Rubavu</h2>
            <p className="text-sm text-gray-600">Automated Parking System</p>
            <p className="text-xs text-gray-500">Rubavu District, Rwanda</p>
          </div>

          {/* Car Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4" />
                Plate Number:
              </span>
              <Badge variant="outline" className="font-mono">
                {receipt.plateNumber}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Owner:
              </span>
              <span className="font-medium">{receipt.ownerName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Slot Number:</span>
              <Badge>{receipt.slotNumber}</Badge>
            </div>
          </div>

          <Separator />

          {/* Time Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Entry Time:
              </span>
              <span className="text-sm">{formatDate(receipt.entryTime)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Exit Time:
              </span>
              <span className="text-sm">{formatDate(receipt.exitTime)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duration:</span>
              <span className="text-sm font-medium">{formatDuration(receipt.duration)}</span>
            </div>
          </div>

          <Separator />

          {/* Charges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Base Rate (1st hour):</span>
              <span className="text-sm">{receipt.charges.baseHour} RWF</span>
            </div>

            {receipt.charges.extraHours > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Extra Hours ({receipt.duration.totalHours - 1}h @ 300 RWF):
                </span>
                <span className="text-sm">{receipt.charges.extraHours} RWF</span>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between text-lg font-bold">
              <span className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Amount:
              </span>
              <span className="text-green-600">{receipt.totalAmount} RWF</span>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Thank you for using SmartPark!</p>
            <p>Receipt generated on {formatDate(Date.now())}</p>
            <p>Have a safe journey!</p>
          </div>
        </div>
      </CardContent>

      <div className="p-4 border-t">
        <Button onClick={handlePrint} className="w-full" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </Card>
  );
};

export default ReceiptDisplay;
