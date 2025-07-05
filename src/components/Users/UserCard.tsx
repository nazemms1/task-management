import { Card, Group, Text, Avatar, Badge } from '@mantine/core';
import { User } from '../../types';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group>
        <Avatar src={user.avatar} size="lg" />
        <div style={{ flex: 1 }}>
          <Text fw={500} size="lg">
            {user.name}
          </Text>
          <Text size="sm" c="dimmed">
            {user.email}
          </Text>
          <Badge color="blue" variant="light" size="sm" mt="xs">
            Active
          </Badge>
        </div>
      </Group>
    </Card>
  );
}