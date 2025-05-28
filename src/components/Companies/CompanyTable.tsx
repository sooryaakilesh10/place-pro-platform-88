import React, { useState } from 'react';
import { Company } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash, Settings, User } from 'lucide-react';

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies = [], onEdit, onDelete }) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'Admin' || user?.role === 'Manager';
  const canEdit = true; // All roles can edit

  const getAssignedUserDisplay = (assignedOfficers: string[]) => {
    if (!assignedOfficers || assignedOfficers.length === 0) {
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center px-2 py-1 bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-full text-gray-500 text-xs">
            <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center mr-1">
              <User className="h-2 w-2 text-gray-400" />
            </div>
            <span className="font-medium">Unassigned</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {assignedOfficers.map((officer, index) => (
          <div key={index} className="flex items-center justify-center">
            <div className="flex items-center px-2 py-1 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-1">
                <User className="h-2 w-2 text-blue-600" />
              </div>
              <Badge variant="outline" className="bg-white/80 text-blue-700 border-blue-200/50 font-medium text-xs">
                {officer}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm shadow-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm border-b border-gray-200/50">
              <TableHead className="font-semibold text-gray-700 min-w-[150px]">Company Name</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[200px]">Address</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Drive</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[100px]">Type</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Follow Up</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[80px]">Contacted</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[150px]">Contact Details</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">HR1 Details</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">HR2 Details</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[100px]">Package</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[150px]">Remarks</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[120px]">Assigned To</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <TableRow key={company.id} className="hover:bg-white/80 backdrop-blur-sm transition-all duration-200 border-b border-gray-100/50">
                  <TableCell className="font-medium">{company.companyName}</TableCell>
                  <TableCell className="max-w-xs">
                    <div title={company.companyAddress} className="truncate">
                      {truncateText(company.companyAddress, 40)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div title={company.drive} className="truncate">
                      {truncateText(company.drive, 20)}
                    </div>
                  </TableCell>
                  <TableCell>{company.typeOfDrive || '-'}</TableCell>
                  <TableCell>
                    <div title={company.followUp} className="truncate">
                      {truncateText(company.followUp, 20)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.isContacted ? "default" : "secondary"} className="bg-opacity-80 backdrop-blur-sm">
                      {company.isContacted ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div title={company.contactDetails} className="truncate">
                      {truncateText(company.contactDetails, 25)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div title={company.hr1Details} className="truncate">
                      {truncateText(company.hr1Details, 20)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div title={company.hr2Details} className="truncate">
                      {truncateText(company.hr2Details, 20)}
                    </div>
                  </TableCell>
                  <TableCell>{company.package || '-'}</TableCell>
                  <TableCell>
                    <div title={company.remarks} className="truncate">
                      {truncateText(company.remarks, 25)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getAssignedUserDisplay(company.assignedOfficer || [])}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(company)}
                          className="bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-blue-50/80 hover:border-blue-200/50 transition-all duration-200"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(company.id)}
                          className="bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-red-50/80 hover:border-red-200/50 transition-all duration-200"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyTable;
