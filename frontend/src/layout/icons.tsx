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
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon/SvgIcon';
import * as React from 'react';

// UI
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
export { default as ChevronRightIcon } from '@material-ui/icons/ChevronRight';
export { default as DeleteIcon } from '@material-ui/icons/Delete';
export { default as ArrowRightIcon } from '@material-ui/icons/ArrowRight';
export { default as ExpandLessIcon } from '@material-ui/icons/ExpandLess';
export { default as ExpandMoreIcon } from '@material-ui/icons/ExpandMore';
export { default as CopyIcon } from '@material-ui/icons/FileCopy';
export { default as EditIcon } from '@material-ui/icons/Edit';
export { default as MoveIcon } from '@material-ui/icons/ArrowForward';
export { default as ArchiveIcon } from '@material-ui/icons/Archive';
export { default as RestoreIcon } from '@material-ui/icons/Unarchive';
export { default as CancelIcon } from '@material-ui/icons/Cancel';
export { default as SaveIcon } from '@material-ui/icons/Save';
export { default as AddCommentIcon } from '@material-ui/icons/AddCommentOutlined';
export { default as ESRIcon } from '@material-ui/icons/AttachMoney';
export { default as StatisticsIcon } from '@material-ui/icons/Equalizer';
export { default as AddEffortIcon } from '@material-ui/icons/AddAlarm';
export { default as VisibleIcon } from '@material-ui/icons/Visibility';
export { default as InvisibleIcon } from '@material-ui/icons/VisibilityOff';
export { default as ImportExportIcon } from '@material-ui/icons/Sync';
export { default as DragHandle } from '@material-ui/icons/DragHandle';
export { default as CloseIcon } from '@material-ui/icons/Close';
export { default as ForwardIcon } from '@material-ui/icons/ArrowForwardIos';
export { default as BackIcon } from '@material-ui/icons/ArrowBackIos';

// Domain
export { default as LogoIcon } from '@material-ui/icons/BeachAccess';
export { default as EmployeeIcon } from '@material-ui/icons/Person';
export { default as OfferIcon } from '@material-ui/icons/Description';
export { default as ServiceIcon } from '@material-ui/icons/RoomService';
export { default as RateGroupIcon } from '@material-ui/icons/Domain';
export { default as RateUnitIcon } from '@material-ui/icons/AttachMoney';
export { default as HolidayIcon } from '@material-ui/icons/Weekend';
export { default as ProjectCategoryIcon } from '@material-ui/icons/Work';
export { default as MasterDataIcon } from '@material-ui/icons/Storage';
export { default as TagsIcon } from '@material-ui/icons/Style';
export { default as TimetrackIcon } from '@material-ui/icons/AccessTime';
export { default as CustomersIcon } from '@material-ui/icons/People';
export { default as PersonIcon } from '@material-ui/icons/PersonOutline';
export { default as CompanyIcon } from '@material-ui/icons/LocationCityOutlined';
export { default as ReportIcon } from '@material-ui/icons/ShowChart';
export { default as SettingsIcon } from '@material-ui/icons/Settings';
export { default as NowIcon } from '@material-ui/icons/MyLocation';

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
