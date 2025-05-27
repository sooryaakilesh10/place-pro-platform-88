
import React, { useState, useEffect } from 'react';
import { Company, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompanyFormProps {
  company?: Company | null;
  onSubmit: (data: Partial<Company>) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Company>>({
    companyName: '',
    companyAddress: '',
    drive: '',
    typeOfDrive: '',
    followUp: '',
    isContacted: false,
    remarks: '',
    contactDetails: '',
    hr1Details: '',
    hr2Details: '',
    package: '',
    assignedOfficer: '',
  });

  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    // Mock users data - in real app, fetch from API
    const mockUsers: User[] = [
      {
        id: '2',
        username: 'manager1',
        email: 'manager1@company.com',
        role: 'Manager',
        createdAt: '2024-01-05T00:00:00Z'
      },
      {
        id: '3',
        username: 'officer1',
        email: 'officer1@company.com',
        role: 'Officer',
        createdAt: '2024-01-10T00:00:00Z'
      },
      {
        id: '4',
        username: 'officer2',
        email: 'officer2@company.com',
        role: 'Officer',
        createdAt: '2024-01-12T00:00:00Z'
      }
    ];
    setAvailableUsers(mockUsers);
  }, []);

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Company, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canAssignUsers = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="package">Package</Label>
          <Input
            id="package"
            value={formData.package}
            onChange={(e) => handleChange('package', e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="companyAddress">Company Address</Label>
          <Textarea
            id="companyAddress"
            value={formData.companyAddress}
            onChange={(e) => handleChange('companyAddress', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drive">Drive</Label>
          <Input
            id="drive"
            value={formData.drive}
            onChange={(e) => handleChange('drive', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="typeOfDrive">Type of Drive</Label>
          <Select value={formData.typeOfDrive} onValueChange={(value) => handleChange('typeOfDrive', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select drive type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On-Campus">On-Campus</SelectItem>
              <SelectItem value="Off-Campus">Off-Campus</SelectItem>
              <SelectItem value="Virtual">Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="followUp">Follow Up</Label>
          <Input
            id="followUp"
            value={formData.followUp}
            onChange={(e) => handleChange('followUp', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactDetails">Contact Details</Label>
          <Input
            id="contactDetails"
            value={formData.contactDetails}
            onChange={(e) => handleChange('contactDetails', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hr1Details">HR1 Details</Label>
          <Input
            id="hr1Details"
            value={formData.hr1Details}
            onChange={(e) => handleChange('hr1Details', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hr2Details">HR2 Details</Label>
          <Input
            id="hr2Details"
            value={formData.hr2Details}
            onChange={(e) => handleChange('hr2Details', e.target.value)}
          />
        </div>

        {canAssignUsers && (
          <div className="space-y-2">
            <Label htmlFor="assignedOfficer">Assign Officer/Manager</Label>
            <Select value={formData.assignedOfficer} onValueChange={(value) => handleChange('assignedOfficer', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select user to assign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.username}>
                    {user.username} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isContacted"
            checked={formData.isContacted}
            onCheckedChange={(checked) => handleChange('isContacted', checked)}
          />
          <Label htmlFor="isContacted">Company Contacted</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {company ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
