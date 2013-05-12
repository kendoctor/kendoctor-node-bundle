<?php

namespace Kendoctor\Bundle\NodeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BookCategory
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class BookCategory
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }
}
