
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

  const canCreateCompany = user?.role === 'Admin' || user?.role === 'Manager';
  const canExport = user?.role === 'Admin' || user?.role === 'Manager';

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockCompanies: Company[] = [
      {
        companyID: '1',
        companyName: 'Tech Solutions Inc',
        companyAddress: '123 Tech Street, Silicon Valley, CA',
        drive: 'Campus Drive 2024',
        typeOfDrive: 'On-Campus',
        followUp: 'Follow up next week',
        isContacted: true,
        remarks: 'Interested in CS students',
        contactDetails: 'hr@techsolutions.com',
        hr1Details: 'John Doe - 555-0101',
        hr2Details: 'Jane Smith - 555-0102',
        package: '12 LPA',
        assignedOfficer: 'officer',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z'
      },
      {
        companyID: '2',
        companyName: 'Digital Innovations Ltd',
        companyAddress: '456 Innovation Drive, Austin, TX',
        drive: 'Virtual Drive 2024',
        typeOfDrive: 'Virtual',
        followUp: 'Awaiting response',
        isContacted: false,
        remarks: 'Looking for software engineers',
        contactDetails: 'careers@digitalinnovations.com',
        hr1Details: 'Mike Johnson - 555-0201',
        hr2Details: 'Sarah Wilson - 555-0202',
        package: '15 LPA',
        assignedOfficer: '',
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-18T16:20:00Z'
      }
    ];
    setCompanies(mockCompanies);
  }, []);

  const handleSubmit = (formData: Partial<Company>) => {
    if (selectedCompany) {
      // Update existing company
      if (user?.role === 'Officer') {
        // For officers, create pending update instead
        toast({
          title: "Update Submitted",
          description: "Your changes have been submitted for approval.",
        });
        setIsFormOpen(false);
        setSelectedCompany(null);
        return;
      }
      
      setCompanies(prev => prev.map(company => 
        company.companyID === selectedCompany.companyID 
          ? { ...company, ...formData, updatedAt: new Date().toISOString() }
          : company
      ));
      toast({
        title: "Company Updated",
        description: "Company details have been updated successfully.",
      });
    } else {
      // Create new company
      const newCompany: Company = {
        companyID: Math.random().toString(36).substr(2, 9),
        ...formData as Company,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCompanies(prev => [...prev, newCompany]);
      toast({
        title: "Company Created",
        description: "New company has been added successfully.",
      });
    }
    
    setIsFormOpen(false);
    setSelectedCompany(null);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleDelete = (companyId: string) => {
    setCompanies(prev => prev.filter(company => company.companyID !== companyId));
    toast({
      title: "Company Deleted",
      description: "Company has been removed from the system.",
    });
  };

  const handleCreateNew = () => {
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

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
