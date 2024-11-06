import { createContext } from 'react';

type ComplianceContextType = {
  setFilter?: (arg: Record<string, any>) => void;
  filter?: Record<string, any>;
};
const ComplianceDetailContext = createContext<ComplianceContextType>({
  setFilter: () => {},
  filter: {},
});

export default ComplianceDetailContext;
