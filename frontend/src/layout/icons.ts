/*
This is the only place where icons should be imported. They can be renamed to something sensible so we don't have to
use e.g. "CreditCardIcon" when we mean "InvoiceIcon".

From https://material-ui.com/style/icons/#svg-icons :

    If your environment doesn't support tree-shaking, the recommended way to import the icons is the following:

    import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
    import ThreeDRotation from '@material-ui/icons/ThreeDRotation';

    If your environment support tree-shaking you can also import the icons this way:

    import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

    Note: Importing named exports in this way will result in the code for every icon being included in your project,
    so is not recommended unless you configure tree-shaking. It may also impact Hot Module Reload performance.
 */

//UI
export { default as MenuIcon } from '@material-ui/icons/Menu';
export { default as PrintIcon } from '@material-ui/icons/Print';
export { default as AccountIcon } from '@material-ui/icons/AccountCircle';
export { default as LogoutIcon } from '@material-ui/icons/ExitToApp';
export { default as SearchIcon } from '@material-ui/icons/Search';
export { default as VisibilityIcon } from '@material-ui/icons/Visibility';
export { default as VisibilityOffIcon } from '@material-ui/icons/VisibilityOff';
export { default as AddIcon } from '@material-ui/icons/Add';
export { default as RefreshIcon } from '@material-ui/icons/Refresh';
export { default as ChevronLeftIcon } from '@material-ui/icons/ChevronLeft';
export { default as DeleteIcon } from '@material-ui/icons/Delete';
export { default as ArrowRightIcon } from '@material-ui/icons/ArrowRight';
export { default as ExpandLessIcon } from '@material-ui/icons/ExpandLess';
export { default as ExpandMoreIcon } from '@material-ui/icons/ExpandMore';
export { default as CopyIcon } from '@material-ui/icons/FileCopy';
export { default as EditIcon } from '@material-ui/icons/Edit';
export { default as ArchiveIcon } from '@material-ui/icons/Archive';
export { default as CancelIcon } from '@material-ui/icons/Cancel';
export { default as SaveIcon } from '@material-ui/icons/Save';
export { default as AddCommentIcon } from '@material-ui/icons/AddComment';
export { default as PaperIcon } from '@material-ui/icons/Description';
export { default as ESRIcon } from '@material-ui/icons/Payment';
export { default as StatisticsIcon } from '@material-ui/icons/Equalizer';

//Domain
export { default as LogoIcon } from '@material-ui/icons/BeachAccess';
export { default as PeopleIcon } from '@material-ui/icons/People';
export { default as OfferIcon } from '@material-ui/icons/InsertDriveFile';
export { default as InvoiceIcon } from '@material-ui/icons/CreditCard';
export { default as ProjectIcon } from '@material-ui/icons/Assignment';
export { default as ServiceIcon } from '@material-ui/icons/RoomService';
export { default as RateGroupIcon } from '@material-ui/icons/Domain';
export { default as RateUnitIcon } from '@material-ui/icons/AttachMoney';
export { default as HolidayIcon } from '@material-ui/icons/Weekend';
export { default as ProjectCategoryIcon } from '@material-ui/icons/Work';
export { default as MasterDataIcon } from '@material-ui/icons/Storage';
export { default as TagsIcon } from '@material-ui/icons/Style';
export { default as TimetrackIcon } from '@material-ui/icons/AccessTime';
