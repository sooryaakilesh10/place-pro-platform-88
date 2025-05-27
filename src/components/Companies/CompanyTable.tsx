
import React, { useState } from 'react';
import { Company } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash, Settings } from 'lucide-react';

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'Admin' || user?.role === 'Manager';
  const canEdit = true; // All roles can edit

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Drive Type</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Contacted</TableHead>
            <TableHead>Assigned Officer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.companyID}>
              <TableCell className="font-medium">{company.companyName}</TableCell>
              <TableCell className="max-w-xs truncate">{company.companyAddress}</TableCell>
              <TableCell>{company.typeOfDrive}</TableCell>
              <TableCell>{company.package}</TableCell>
              <TableCell>
                <Badge variant={company.isContacted ? "default" : "secondary"}>
                  {company.isContacted ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>{company.assignedOfficer || "Unassigned"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(company)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(company.companyID)}
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
