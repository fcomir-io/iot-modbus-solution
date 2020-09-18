export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Data']
  }, 
  {
    _tag: 'CSidebarNavItem',
    name: 'Query Data',
    to: '/data',
    icon: 'cil-puzzle',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Settings']
  },   
  {
    _tag: 'CSidebarNavItem',
    name: 'Testbench',
    to: '/testbench',
    icon: 'cil-puzzle',    
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Devices',
    to: '/devices', 
    icon: 'cilPhone', 
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Signals',
    to: '/signals',   
    icon: 'cil-cursor', 
  },
]

