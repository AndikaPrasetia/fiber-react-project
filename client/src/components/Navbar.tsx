// Mengimpor komponen-komponen dari Chakra UI dan ikon dari react-icons
import { Box, Flex, Button, useColorModeValue, useColorMode, Text, Container } from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

// Mendefinisikan dan mengekspor fungsi komponen Navbar
export default function Navbar() {
	// Menggunakan hook useColorMode untuk mendapatkan mode warna saat ini dan fungsi untuk mengubah mode warna
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		// Menggunakan komponen Container dengan lebar maksimum 900px
		<Container maxW={"900px"}>
			{/* Menggunakan komponen Box dengan latar belakang yang berubah sesuai mode warna, padding horizontal 4, margin vertikal 4, dan border radius 5 */}
			<Box bg={useColorModeValue("gray.400", "gray.700")} px={4} my={4} borderRadius={"5"}>
				{/* Menggunakan komponen Flex dengan tinggi 16, alignItems center, dan justifyContent space-between */}
				<Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
					{/* SISI KIRI */}
					{/* Menggunakan komponen Flex dengan justifyContent center, alignItems center, gap 3, dan display none pada base dan flex pada sm */}
					<Flex
						justifyContent={"center"}
						alignItems={"center"}
						gap={3}
						display={{ base: "none", sm: "flex" }}
					>
						{/* Menampilkan gambar logo react */}
						<img src='/react.png' alt='logo' width={50} height={50} />
						{/* Menampilkan teks "+" dengan font size 40 */}
						<Text fontSize={"40"}>+</Text>
						{/* Menampilkan gambar logo go */}
						<img src='/go.png' alt='logo' width={40} height={40} />
						{/* Menampilkan teks "=" dengan font size 40 */}
						<Text fontSize={"40"}>=</Text>
						{/* Menampilkan gambar logo explode */}
						<img src='/explode.png' alt='logo' width={50} height={50} />
					</Flex>

					{/* SISI KANAN */}
					{/* Menggunakan komponen Flex dengan alignItems center dan gap 3 */}
					<Flex alignItems={"center"} gap={3}>
						{/* Menampilkan teks "Daily Tasks" dengan font size lg dan font weight 500 */}
						<Text fontSize={"lg"} fontWeight={500}>
							Daily Tasks
						</Text>
						{/* Tombol untuk mengubah mode warna */}
						<Button onClick={toggleColorMode}>
							{/* Menampilkan ikon bulan jika mode warna adalah light, dan ikon matahari jika mode warna adalah dark */}
							{colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Container>
	);
}