/*
This is the only place where icons should be imported. They can be renamed to something sensible so we don't have to
use e.g. "CreditCardIcon" when we mean "InvoiceIcon".

From https://material-ui.com/style/icons/#svg-icons :

    If your environment doesn't support tree-shaking, the recommended way to import the icons is the following:

    import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
    import ThreeDRotation from '@mui/icons-material/ThreeDRotation';

    If your environment support tree-shaking you can also import the icons this way:

    import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';

    Note: Importing named exports in this way will result in the code for every icon being included in your project,
    so is not recommended unless you configure tree-shaking. It may also impact Hot Module Reload performance.
 */
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import * as React from 'react';

// UI
export { default as MenuIcon } from '@mui/icons-material/Menu';
export { default as PrintIcon } from '@mui/icons-material/Print';
export { default as AccountIcon } from '@mui/icons-material/AccountCircle';
export { default as LogoutIcon } from '@mui/icons-material/ExitToApp';
export { default as SearchIcon } from '@mui/icons-material/Search';
export { default as VisibilityIcon } from '@mui/icons-material/Visibility';
export { default as VisibilityOffIcon } from '@mui/icons-material/VisibilityOff';
export { default as AddIcon } from '@mui/icons-material/Add';
export { default as RefreshIcon } from '@mui/icons-material/Refresh';
export { default as ChevronLeftIcon } from '@mui/icons-material/ChevronLeft';
export { default as DeleteIcon } from '@mui/icons-material/Delete';
export { default as ArrowRightIcon } from '@mui/icons-material/ArrowRight';
export { default as ExpandLessIcon } from '@mui/icons-material/ExpandLess';
export { default as ExpandMoreIcon } from '@mui/icons-material/ExpandMore';
export { default as CopyIcon } from '@mui/icons-material/FileCopy';
export { default as EditIcon } from '@mui/icons-material/Edit';
export { default as MoveIcon } from '@mui/icons-material/ArrowForward';
export { default as ArchiveIcon } from '@mui/icons-material/Archive';
export { default as RestoreIcon } from '@mui/icons-material/Unarchive';
export { default as CancelIcon } from '@mui/icons-material/Cancel';
export { default as SaveIcon } from '@mui/icons-material/Save';
export { default as AddCommentIcon } from '@mui/icons-material/AddCommentOutlined';
export { default as ESRIcon } from '@mui/icons-material/AttachMoney';
export { default as StatisticsIcon } from '@mui/icons-material/Equalizer';
export { default as AddEffortIcon } from '@mui/icons-material/AddAlarm';
export { default as VisibleIcon } from '@mui/icons-material/Visibility';
export { default as InvisibleIcon } from '@mui/icons-material/VisibilityOff';
export { default as ImportExportIcon } from '@mui/icons-material/Sync';
export { default as DragHandle } from '@mui/icons-material/DragHandle';
export { default as CloseIcon } from '@mui/icons-material/Close';
export { default as ForwardIcon } from '@mui/icons-material/ArrowForwardIos';
export { default as BackIcon } from '@mui/icons-material/ArrowBackIos';
export { default as MailIcon } from '@mui/icons-material/Mail';
export { default as Renew } from '@mui/icons-material/Autorenew';
export { default as SortIcon } from '@mui/icons-material/Sort';
export { default as RenameIcon } from '@mui/icons-material/Create';
export { default as ReorderIcon } from '@mui/icons-material/SwapVert';
export { default as LanguageIcon } from '@mui/icons-material/Translate';
export { default as HelpIcon } from '@mui/icons-material/Help';

// Domain
export { default as LogoIcon } from '@mui/icons-material/BeachAccess';
export { default as EmployeeIcon } from '@mui/icons-material/Person';
export { default as OfferIcon } from '@mui/icons-material/Description';
export { default as ServiceIcon } from '@mui/icons-material/RoomService';
export { default as ServiceCategoryIcon } from '@mui/icons-material/AccountTree';
export { default as RateGroupIcon } from '@mui/icons-material/Domain';
export { default as RateUnitIcon } from '@mui/icons-material/AttachMoney';
export { default as HolidayIcon } from '@mui/icons-material/Weekend';
export { default as ProjectCategoryIcon } from '@mui/icons-material/Work';
export { default as MasterDataIcon } from '@mui/icons-material/Storage';
export { default as TagsIcon } from '@mui/icons-material/Style';
export { default as TimetrackIcon } from '@mui/icons-material/AccessTime';
export { default as CustomersIcon } from '@mui/icons-material/People';
export { default as PersonIcon } from '@mui/icons-material/PersonOutline';
export { default as CompanyIcon } from '@mui/icons-material/LocationCityOutlined';
export { default as ReportIcon } from '@mui/icons-material/ShowChart';
export { default as SettingsIcon } from '@mui/icons-material/Settings';
export { default as NowIcon } from '@mui/icons-material/MyLocation';
export { default as CostgroupIcon } from '@mui/icons-material/AccountBalance';
export { default as LocationIcon } from '@mui/icons-material/Home';

const icon = (path: React.ReactNode, viewBox = 512) => {
  return (props: SvgIconProps) => React.createElement(SvgIcon, { viewBox: `0 0 ${viewBox} ${viewBox}`, ...props }, path);
};

// To add a new icon, open its svg file and copy the relevant paths like seen below. If the icon isn't sized properly
// or doesn't show up, make sure the viewBox matches with what's provided in the svg file.

// Schaufel
export const ProjectIcon = icon(
  <path
    d="M506.741,84.812L427.188,5.259c-7.009-7.011-18.377-7.01-25.389-0.001l-30.468,30.468
    c-23.011,23.011-27.7,57.49-14.109,85.199L152.766,325.38l-38.396-38.396c-4.402-4.401-11.538-4.401-15.941,0l-63.685,63.685
    C6.335,379.078-5.762,419.938,2.6,459.235l6.877,32.315c1.171,5.502,5.469,9.8,10.972,10.971l32.315,6.877
    c39.298,8.364,80.158-3.735,108.568-32.145l63.685-63.685c4.402-4.401,4.401-11.538,0-15.941l-38.396-38.396l204.429-204.428
    c27.281,13.445,61.82,9.27,85.226-14.136l30.468-30.468C513.752,103.189,513.752,91.823,506.741,84.812z
    M450.884,115.28 c-14.958,14.958-39.177,14.975-54.152,0.012c-0.004-0.004-0.007-0.008-0.011-0.012c-0.004-0.004-0.008-0.007-0.012-0.011
    c-14.922-14.934-14.918-39.224,0.011-54.152l17.773-17.773l54.164,54.164L450.884,115.28z"
  />,
);

// Rechner
export const InvoiceIcon = icon(
  <path
    d="M50.586,0H9.414C7.807,0,6.5,1.308,6.5,2.914v54.172C6.5,58.692,7.807,60,9.414,60h41.172c1.607,0,2.914-1.308,2.914-2.914
    V2.914C53.5,1.308,52.193,0,50.586,0z M22.5,55h-11V44h11V55z M22.5,42h-11V31h11V42z M22.5,29h-11V18h11V29z M35.5,55h-11V44h11V55
    z M35.5,42h-11V31h11V42z M35.5,29h-11V18h11V29z M48.5,55h-11V31h11V55z M48.5,29h-11V18h11V29z M48.5,15h-37V5h37V15z"
  />,
  60,
);
