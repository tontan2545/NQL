import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="flex justify-center items-center py-16 w-full">
      <Link
        href="https://aws.amazon.com/what-is-cloud-computing"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB.61d334f1a1a427ea597afa54be359ca5a5aaad5f.png"
          width={160}
          height={200}
          alt="Powered by AWS Cloud Computing"
        />
      </Link>
    </div>
  );
};

export default Footer;
