import { SettingsIcon, UsersIcon } from 'lucide-react';
import { IconType } from 'react-icons';
import {
	GoCheckCircle,
	GoCheckCircleFill,
	GoHome,
	GoHomeFill,
} from 'react-icons/go';

export type NavigationItem = {
	label: string;
	href: string;
	icon: IconType;
	activeIcon: IconType;
};

export const navigationRoutes: NavigationItem[] = [
	{
		label: 'Home',
		href: '',
		icon: GoHome,
		activeIcon: GoHomeFill,
	},
	{
		label: 'My Tasks',
		href: '/tasks',
		icon: GoCheckCircle,
		activeIcon: GoCheckCircleFill,
	},
	{
		label: 'Settings',
		href: '/settings',
		icon: SettingsIcon,
		activeIcon: SettingsIcon,
	},
	{
		label: 'Members',
		href: '/members',
		icon: UsersIcon,
		activeIcon: UsersIcon,
	},
];
