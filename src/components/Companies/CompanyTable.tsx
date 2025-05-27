
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

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'Admin' || user?.role === 'Manager';
  const canEdit = true; // All roles can edit

  const getAssignedUserDisplay = (assignedOfficer: string) => {
    if (!assignedOfficer) {
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center px-3 py-2 bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-full text-gray-500 text-sm">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
              <User className="h-3 w-3 text-gray-400" />
            </div>
            <span className="font-medium">Unassigned</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-2">
            <User className="h-3 w-3 text-blue-600" />
          </div>
          <Badge variant="outline" className="bg-white/80 text-blue-700 border-blue-200/50 font-medium">
            {assignedOfficer}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm border-b border-gray-200/50">
            <TableHead className="font-semibold text-gray-700">Company Name</TableHead>
            <TableHead className="font-semibold text-gray-700">Address</TableHead>
            <TableHead className="font-semibold text-gray-700">Drive Type</TableHead>
            <TableHead className="font-semibold text-gray-700">Package</TableHead>
            <TableHead className="font-semibold text-gray-700">Contacted</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Assigned To</TableHead>
            <TableHead className="font-semibold text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.companyID} className="hover:bg-white/80 backdrop-blur-sm transition-all duration-200 border-b border-gray-100/50">
              <TableCell className="font-medium">{company.companyName}</TableCell>
              <TableCell className="max-w-xs truncate">{company.companyAddress}</TableCell>
              <TableCell>{company.typeOfDrive}</TableCell>
              <TableCell>{company.package}</TableCell>
              <TableCell>
                <Badge variant={company.isContacted ? "default" : "secondary"} className="bg-opacity-80 backdrop-blur-sm">
                  {company.isContacted ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>
                {getAssignedUserDisplay(company.assignedOfficer || "")}
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
                      onClick={() => onDelete(company.companyID)}
                      className="bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-red-50/80 hover:border-red-200/50 transition-all duration-200"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
