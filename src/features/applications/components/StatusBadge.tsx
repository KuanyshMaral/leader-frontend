import { Badge } from '@shared/components/ui';
import { ApplicationStatus } from '@shared/types/enums';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '@shared/lib/constants';

interface StatusBadgeProps {
    status: ApplicationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const label = APPLICATION_STATUS_LABELS[status] || status;
    const color = APPLICATION_STATUS_COLORS[status] || 'gray';

    return <Badge variant={color as any}>{label}</Badge>;
};
