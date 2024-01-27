
interface LogoProps {
      width?: string,
      height?: string
}
export default function Logo ({ width, height }: LogoProps): JSX.Element {
      return (
            <svg className="hover:scale-110 transition-transform duration-300 cursor-pointer" width={width || "35"} height={height || "35"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" >
                  <g clipPath="url(#clip0_8_1367)">
                        <path fill="#0099ff" d="M16 24.392C14.5215 25.2607 12.8397 25.7234 11.1249 25.7332C9.41006 25.743 7.72309 25.2995 6.23474 24.4478C4.74639 23.596 3.50949 22.3662 2.64924 20.8827C1.78899 19.3992 1.33594 17.7148 1.33594 16C1.33594 14.2852 1.78899 12.6007 2.64924 11.1173C3.50949 9.63382 4.74639 8.40397 6.23474 7.55221C7.72309 6.70045 9.41006 6.25702 11.1249 6.26682C12.8397 6.27662 14.5215 6.73929 16 7.608C17.4785 6.73929 19.1603 6.27662 20.8751 6.26682C22.5899 6.25702 24.2769 6.70045 25.7653 7.55221C27.2536 8.40397 28.4905 9.63382 29.3508 11.1173C30.211 12.6007 30.6641 14.2852 30.6641 16C30.6641 17.7148 30.211 19.3992 29.3508 20.8827C28.4905 22.3662 27.2536 23.596 25.7653 24.4478C24.2769 25.2995 22.5899 25.743 20.8751 25.7332C19.1603 25.7234 17.4785 25.2607 16 24.392ZM18.2693 22.5467C19.3422 22.9827 20.5059 23.1484 21.6578 23.0291C22.8098 22.9098 23.9148 22.5092 24.8756 21.8626C25.8364 21.2159 26.6235 20.3431 27.1678 19.3208C27.712 18.2985 27.9966 17.1581 27.9966 16C27.9966 14.8419 27.712 13.7015 27.1678 12.6792C26.6235 11.6569 25.8364 10.7841 24.8756 10.1374C23.9148 9.49079 22.8098 9.0902 21.6578 8.97092C20.5059 8.85163 19.3422 9.01729 18.2693 9.45333C19.9007 11.243 20.8035 13.5783 20.8 16C20.8 18.52 19.8413 20.8187 18.2693 22.5467ZM13.7307 9.45333C12.6578 9.01729 11.4941 8.85163 10.3422 8.97092C9.1902 9.0902 8.0852 9.49079 7.12441 10.1374C6.16362 10.7841 5.37648 11.6569 4.83224 12.6792C4.28801 13.7015 4.00338 14.8419 4.00338 16C4.00338 17.1581 4.28801 18.2985 4.83224 19.3208C5.37648 20.3431 6.16362 21.2159 7.12441 21.8626C8.0852 22.5092 9.1902 22.9098 10.3422 23.0291C11.4941 23.1484 12.6578 22.9827 13.7307 22.5467C12.0993 20.757 11.1965 18.4217 11.2 16C11.2 13.48 12.1587 11.1813 13.7307 9.45333ZM16 10.94C15.3238 11.5977 14.7865 12.3844 14.4201 13.2536C14.0536 14.1228 13.8654 15.0567 13.8667 16C13.8667 17.984 14.684 19.776 16 21.06C16.6762 20.4023 17.2135 19.6156 17.5799 18.7464C17.9464 17.8772 18.1346 16.9433 18.1333 16C18.1346 15.0567 17.9464 14.1228 17.5799 13.2536C17.2135 12.3844 16.6762 11.5977 16 10.94Z"></path>
                  </g>
                  <defs>
                        <clipPath id="clip0_8_1367">
                              <rect fill="white" height="32" width="32"></rect>
                        </clipPath>
                  </defs>
            </svg>
      )

}