import React, { useState, useEffect } from 'react';
import { Company } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import CompanyTable from '@/components/Companies/CompanyTable';
import CompanyForm from '@/components/Companies/CompanyForm';
import ExcelExport from '@/components/Reports/ExcelExport';
import { Plus } from 'lucide-react';

const Companies: React.FC = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const canCreateCompany = user?.role === 'Admin' || user?.role === 'Manager';
  const canExport = user?.role === 'Admin' || user?.role === 'Manager';

  const fetchCompanies = async () => {
    try {
      const endpoint = user?.role === 'Officer' 
        ? `http://localhost:8080/company/list/${user.username}`
        : 'http://localhost:8080/company/list';
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch companies. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (formData: Partial<Company>) => {
    try {
      if (selectedCompany) {
        // Update existing company
        if (user?.role === 'Officer') {
          // For officers, use the temporary update endpoint
          const response = await fetch('http://localhost:8080/company/temp/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              company_id: selectedCompany.id,
              company_name: formData.companyName,
              company_address: formData.companyAddress,
              drive: formData.drive,
              type_of_drive: formData.typeOfDrive,
              follow_up: formData.followUp,
              is_contacted: formData.isContacted,
              remarks: formData.remarks,
              contact_details: formData.contactDetails,
              hr1_details: formData.hr1Details,
              hr2_details: formData.hr2Details,
              package: formData.package,
              assigned_officer: selectedCompany.assignedOfficer,
              created_by: user.username
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to submit update request');
          }

          toast({
            title: "Update Submitted",
            description: "Your changes have been submitted for approval.",
          });
          setIsFormOpen(false);
          setSelectedCompany(null);
          await fetchCompanies();
          return;
        }
        
        const response = await fetch(`http://localhost:8080/company/update/${selectedCompany.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to update company');
        }

        toast({
          title: "Company Updated",
          description: "Company details have been updated successfully.",
        });
      } else {
        // Create new company
        const response = await fetch('http://localhost:8080/company/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create company');
        }

        toast({
          title: "Company Created",
          description: "New company has been added successfully.",
        });
      }
      
      // Refresh the companies list
      await fetchCompanies();
      setIsFormOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "Error",
        description: "Failed to save company. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleDelete = async (companyId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/company/delete/${companyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete company');
      }

      await fetchCompanies();
      toast({
        title: "Company Deleted",
        description: "Company has been removed from the system.",
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Error",
        description: "Failed to delete company. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600">Manage company information and placements</p>
        </div>
        
        <div className="flex space-x-2">
          {canExport && (
            <ExcelExport companies={companies} filename="companies_report" />
          )}
          
          {canCreateCompany && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedCompany ? 'Edit Company' : 'Add New Company'}
                  </DialogTitle>
                </DialogHeader>
                <CompanyForm
                  company={selectedCompany}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setSelectedCompany(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <CompanyTable
        companies={companies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Companies;
