import { crc32, deflateRawSync } from 'zlib';

interface ZipEntry {
  content: Buffer | string;
  name: string;
}

type Compression = 'deflate' | 'store';

const COMPRESSION_METHODS: Record<Compression, number> = { deflate: 8, store: 0 };
const ZIP_VERSION = 20;
const LOCAL_HEADER_SIGNATURE = 0x04034b50;
const LOCAL_HEADER_SIZE = 30;
const CENTRAL_HEADER_SIGNATURE = 0x02014b50;
const CENTRAL_HEADER_SIZE = 46;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const END_OF_CENTRAL_DIRECTORY_SIZE = 22;

export function createZip(entries: ZipEntry[], compression: Compression = 'store'): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const file = encodeFile(entry, compression);
    const local = Buffer.concat([createLocalHeader(file), file.name, file.stored]);
    localParts.push(local);
    centralParts.push(createCentralHeader(file, offset), file.name);
    offset += local.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = createEndOfCentralDirectory(entries.length, centralDirectory.length, offset);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function encodeFile({ content, name }: ZipEntry, compression: Compression) {
  const raw = Buffer.from(content);

  return {
    checksum: crc32(raw),
    method: COMPRESSION_METHODS[compression],
    name: Buffer.from(name),
    size: raw.length,
    stored: compression === 'deflate' ? deflateRawSync(raw) : raw,
  };
}

function createLocalHeader(file: ReturnType<typeof encodeFile>): Buffer {
  const header = Buffer.alloc(LOCAL_HEADER_SIZE);
  header.writeUInt32LE(LOCAL_HEADER_SIGNATURE, 0);
  header.writeUInt16LE(ZIP_VERSION, 4);
  header.writeUInt16LE(file.method, 8);
  header.writeUInt32LE(file.checksum, 14);
  header.writeUInt32LE(file.stored.length, 18);
  header.writeUInt32LE(file.size, 22);
  header.writeUInt16LE(file.name.length, 26);
  return header;
}

function createCentralHeader(file: ReturnType<typeof encodeFile>, localHeaderOffset: number): Buffer {
  const header = Buffer.alloc(CENTRAL_HEADER_SIZE);
  header.writeUInt32LE(CENTRAL_HEADER_SIGNATURE, 0);
  header.writeUInt16LE(ZIP_VERSION, 4);
  header.writeUInt16LE(ZIP_VERSION, 6);
  header.writeUInt16LE(file.method, 10);
  header.writeUInt32LE(file.checksum, 16);
  header.writeUInt32LE(file.stored.length, 20);
  header.writeUInt32LE(file.size, 24);
  header.writeUInt16LE(file.name.length, 28);
  header.writeUInt32LE(localHeaderOffset, 42);
  return header;
}

function createEndOfCentralDirectory(entryCount: number, directorySize: number, directoryOffset: number): Buffer {
  const record = Buffer.alloc(END_OF_CENTRAL_DIRECTORY_SIZE);
  record.writeUInt32LE(END_OF_CENTRAL_DIRECTORY_SIGNATURE, 0);
  record.writeUInt16LE(entryCount, 8);
  record.writeUInt16LE(entryCount, 10);
  record.writeUInt32LE(directorySize, 12);
  record.writeUInt32LE(directoryOffset, 16);
  return record;
}
